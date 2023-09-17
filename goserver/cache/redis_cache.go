package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/firhan200/taktodoi/goserver/dto"
	"github.com/redis/go-redis/v9"
)

type RedisCache struct {
	Client *redis.Client
}

var (
	redisCache *RedisCache
)

func NewRedisCache() *RedisCache {
	if redisCache != nil {
		return redisCache
	}

	c := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	redisCache = &RedisCache{
		Client: c,
	}

	return redisCache
}

func (rc *RedisCache) SaveTasks(data dto.CreatedTask) error {
	key := fmt.Sprintf("tasks:%d", data.UserId)

	jsonBody, _ := json.Marshal(data)

	err := rc.Client.LPush(context.Background(), key, jsonBody, 0).Err()
	if err != nil {
		log.Printf("failed save to cache: %s\n", err.Error())
		return err
	}

	log.Printf("saving task into cache %s=%+v", key, data)

	return nil
}

func (rc *RedisCache) GetTasks(userId int) []dto.CreatedTask {
	key := fmt.Sprintf("tasks:%d", userId)

	res, err := rc.Client.LRange(context.Background(), key, 0, 500).Result()
	if err != nil {
		log.Println(err.Error())
	}

	tasks := make([]dto.CreatedTask, 0)
	for _, body := range res {
		var task dto.CreatedTask
		err := json.Unmarshal([]byte(body), &task)
		if err != nil {
			continue
		}

		tasks = append(tasks, task)
	}

	return tasks
}
