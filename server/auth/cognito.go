package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"

	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
)


var Cognito CognitoInfo

type CognitoInfo struct {
	Client *cognito.CognitoIdentityProvider
	UserPoolID string
	AppClientID string
	AppClientSecret string
}

// Computes Secret Hash to avoid server impersonation
func CognitoSecretHash (username string) string {
	mac := hmac.New(sha256.New, []byte(Cognito.AppClientSecret))	// key is the client secret
	mac.Write([]byte(username + Cognito.AppClientID))				// append username to app client id
	secretHash := base64.StdEncoding.EncodeToString(mac.Sum(nil))
	return secretHash
}