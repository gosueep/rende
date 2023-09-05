package auth

import (
	"fmt"
	"net/http"

	"rende/db"
	// "rende/event"
	// "rende/org"

	"github.com/gin-gonic/gin"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
)


func RegisterUser(c *gin.Context) {
	var json struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
		Email string `json:"email" binding:"required"`
		Name string `json:"name" binding:"required"`
		Organization string `json:"org"`
	}

	err := c.BindJSON(&json)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, fmt.Sprintf("User creation request malformed %s", db.Sad()))
		return
	} 

	// User to be created
	user := &cognito.SignUpInput{
		Username: aws.String(json.Username),
		Password: aws.String(json.Password),
		ClientId: aws.String(Cognito.AppClientID),
		UserAttributes: []*cognito.AttributeType{
			{
				Name: aws.String("email"),
				Value: aws.String(json.Email),
			},
			{
				Name: aws.String("name"),
				Value: aws.String(json.Name),
			},
			{
				Name: aws.String("custom:Organization"),
				Value: aws.String(json.Organization),
			},
		},
		SecretHash: aws.String(CognitoSecretHash(json.Username)),
	}

	// Call Cognito to create user
	_, err = Cognito.Client.SignUp(user)
	if err != nil {

		fmt.Println(err)

		if aerr, ok := err.(awserr.Error); ok {
			msg := aerr.Message()
			// switch aerr.Code() {
			// case cognito.ErrCodeUsernameExistsException:
			// 	msg = fmt.Sprintf()
			// case cognito.ErrCodeInvalidParameterException:
			// 	exitErrorf("object with key %s does not exist in bucket %s", os.Args[2], os.Args[1])
			// }
			c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed creating user %s \n%s", db.Sad(), msg))
		}

	} else {
		c.JSON(http.StatusOK, fmt.Sprintf("User successfully created %s", db.Happy()))
	}
}
