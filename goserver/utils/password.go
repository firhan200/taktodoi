package utils

import (
	"crypto/sha1"
	"encoding/hex"
)

type Password struct {
	value string
}

func NewPassword(s string) *Password {
	return &Password{
		value: s,
	}
}

func (p *Password) Encrypt() string {
	h := sha1.New()
	h.Write([]byte(p.value))
	res := hex.EncodeToString(h.Sum(nil))

	return string(res)
}
