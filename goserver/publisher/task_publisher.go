package publisher

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/firhan200/taktodoi/goserver/dto"
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

func (p *TaskPublisher) Publish(message *dto.CreatedTask) error {
	//serialize message
	body, jErr := json.Marshal(message)
	if jErr != nil {
		return jErr
	}

	p.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
	_, err := p.conn.WriteMessages(
		kafka.Message{Value: body},
	)
	if err != nil {
		log.Fatal("failed to write messages:", err)
	}

	log.Printf("message published: %+v\n", message)

	return nil
}
