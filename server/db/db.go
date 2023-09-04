package db

import (
	"github.com/jackc/pgx/v5/pgxpool"

	// this is so stupid lmao, maybe make another package if I stop being so lazy
	"math/rand"
	"time"
)

var Conn *pgxpool.Pool

var sadMsgs = [8]string{
	`:(`, `:[`, `:p`, `|:¬(`, `|:'(`, `D:`, `(╯°□°)╯︵ ┻━┻`,
}
var happyMsgs = [9]string{
	`:)`, `:]`, `:3`, `:D`, `';. ¬ )`, 
	`(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧`, `ヾ(＠⌒▽⌒＠)ﾉ`, `(▰˘◡˘▰)`,
	`(>'-')> <('-'<) ^('-')^ v('-')v(>'-')> (^-^)`,
}
func Sad() string {
	r := rand.New(rand.NewSource(time.Now().Unix()))
	return sadMsgs[r.Intn(len(sadMsgs))]
}
func Happy() string {
	r := rand.New(rand.NewSource(time.Now().Unix()))
	return happyMsgs[r.Intn(len(happyMsgs))]
}