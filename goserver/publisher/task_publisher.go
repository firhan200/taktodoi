package publisher

import (
	"context"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

type TaskPublisher struct {
	conn *kafka.Conn
}

func NewTaskPublisher() *TaskPublisher {
	// to produce messages
	topic := "task-topic"
	partition := 0

	conn, err := kafka.DialLeader(context.Background(), "tcp", "localhost:29092", topic, partition)
	if err != nil {
		log.Fatal("failed to dial leader:", err)
	}

	return &TaskPublisher{
		conn: conn,
	}
}

func (p *TaskPublisher) Publish(message string) {
	p.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
	_, err := p.conn.WriteMessages(
		kafka.Message{Value: []byte(message)},
	)
	if err != nil {
		log.Fatal("failed to write messages:", err)
	}

	if err := p.conn.Close(); err != nil {
		log.Fatal("failed to close writer:", err)
	}

	log.Printf("message published: %s\n", message)
}
