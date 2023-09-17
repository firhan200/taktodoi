package consumers

import (
	"context"
	"fmt"
	"log"

	"github.com/segmentio/kafka-go"
)

type TaskConsumer struct {
	reader *kafka.Reader
}

func NewTaskConsumer() *TaskConsumer {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   []string{"localhost:29092"},
		Topic:     "task-topic",
		Partition: 0,
		MaxBytes:  10e6, // 10MB
	})

	return &TaskConsumer{
		reader: r,
	}
}

func (tc *TaskConsumer) Consume() {
	for {
		m, err := tc.reader.ReadMessage(context.Background())
		if err != nil {
			break
		}
		fmt.Printf("message %s = %s\n", string(m.Key), string(m.Value))
	}

	if err := tc.reader.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
}
