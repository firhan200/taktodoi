package cache

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/firhan200/taktodoi/goserver/dto"
	"github.com/redis/go-redis/v9"
)

type Redis interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) *redis.StatusCmd
	Get(ctx context.Context, key string) *redis.StringCmd
	Del(ctx context.Context, keys ...string) *redis.IntCmd
}

type RedisCache struct {
	Client Redis
}

func NewRedisCache(r Redis) *RedisCache {
	return &RedisCache{
		Client: r,
	}
}

func (rc *RedisCache) SetLastIndexRead(offset int) {
	err := rc.Client.Set(context.Background(), "kafka_offset", offset, 0).Err()
	if err != nil {
		log.Fatal(err)
	}
}

func (rc *RedisCache) GetOffset() int {
	o, err := rc.Client.Get(context.Background(), "kafka_offset").Result()
	if err != nil {
		log.Fatal(err)
		return 0
	}

	log.Printf("found offset on: %s", o)

	offset, _ := strconv.Atoi(o)

	return offset
}

func (rc *RedisCache) SaveTasks(userId int, data []dto.Task) error {
	key := fmt.Sprintf("tasks:%d", userId)

	jsonBody, _ := json.Marshal(data)

	err := rc.Client.Set(context.Background(), key, jsonBody, time.Duration(time.Hour*1)).Err()
	if err != nil {
		log.Printf("failed save to cache: %s\n", err.Error())
		return err
	}

	log.Printf("saving tasks into cache %s=%+v", key, data)

	return nil
}

func (rc *RedisCache) GetTasks(userId int) ([]dto.Task, error) {
	var tasks []dto.Task

	key := fmt.Sprintf("tasks:%d", userId)

	res, err := rc.Client.Get(context.Background(), key).Result()
	if err == redis.Nil {
		return tasks, errors.New("key did not exist")
	}

	parseErr := json.Unmarshal([]byte(res), &tasks)
	if parseErr != nil {
		return tasks, parseErr
	}

	return tasks, nil
}

func (rc *RedisCache) DeleteTasks(userId int) error {
	key := fmt.Sprintf("tasks:%d", userId)

	err := rc.Client.Del(context.Background(), key).Err()
	if err != nil {
		return err
	}

	return nil
}
