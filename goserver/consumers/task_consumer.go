package consumers

import (
	"context"
	"log"

	"github.com/firhan200/taktodoi/goserver/cache"
	"github.com/segmentio/kafka-go"
)

type TaskConsumer struct {
	reader *kafka.Reader
	cache  *cache.RedisCache
}

func NewTaskConsumer() *TaskConsumer {
	client := cache.NewRedisCache()

	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   []string{"localhost:29092"},
		Topic:     "task-topic",
		Partition: 0,
		MaxBytes:  10e6, // 10MB
	})
	r.SetOffset(int64(client.GetOffset()))

	return &TaskConsumer{
		reader: r,
		cache:  client,
	}
}

func (tc *TaskConsumer) Consume() {
	for {
		m, err := tc.reader.ReadMessage(context.Background())
		if err != nil {
			break
		}

		log.Printf("receive message: %+v", m.Value)

		saveErr := tc.saveToCache(m)

		if saveErr != nil {
			log.Println(saveErr.Error())
		}

		//set offset
		tc.cache.SetLastIndexRead(int(tc.reader.Offset()))
	}

	if err := tc.reader.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
}

func (tc *TaskConsumer) saveToCache(m kafka.Message) error {
	// var (
	// 	createdTask dto.Task
	// )
	// err := json.Unmarshal(m.Value, &createdTask)
	// if err != nil {
	// 	msg := fmt.Sprintf("error when consuming message: %s\n", m.Value)
	// 	return errors.New(msg)
	// }

	// //save to redis
	// cacheErr, _ := tc.cache.SaveTasks(createdTask)
	// if cacheErr != nil {
	// 	return cacheErr
	// }

	return nil
}
