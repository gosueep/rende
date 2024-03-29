package auth

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	supa "github.com/nedpals/supabase-go"

	"github.com/golang-jwt/jwt"
)


var Supabase *supa.Client
var JWT_SECRET []byte

func VerifyToken(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, fmt.Errorf("incorrect signing method")
	}
	return JWT_SECRET, nil
}

func CheckAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get Token
		// authHeader := c.GetHeader("Authorization")
		tokenString, err := c.Cookie("token")
		if err != nil || tokenString == "" {
			fmt.Println("Malformed token?")
			fmt.Println(err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, "You must provide a token")
			return
		}

		// // Parse Authentication Header
		// headerStrs := strings.Split(authHeader, " ")
		// if len(headerStrs) != 2 {
		// 	fmt.Println("Malformed token?")
		// 	c.AbortWithStatusJSON(http.StatusUnauthorized, "Token invalid")
		// 	return
		// }
		// tokenString := headerStrs[1]		// split off "Bearer" in auth Header

		// Parse and Verify Token with secret token
		token, err := jwt.Parse(tokenString, VerifyToken)
		if err != nil {
			fmt.Println("Failed Verifying token", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, "Token invalid")
			return
		}

		// If valid, pass to next function
		if token.Valid {
			// c.Set("token", token)
			c.Set("tokenString", tokenString)
			c.Set("uid", token.Claims.(jwt.MapClaims)["sub"])
			c.Next()
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, "Token invalid")
			return
		}
	}
}