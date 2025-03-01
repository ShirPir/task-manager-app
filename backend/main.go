package main

import (
	"database/sql"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // PostgreSQL driver
)

type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"` // e.g., "pending", "in_progress", "completed"
}

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		panic(err)
	}
	defer db.Close()
	
	router := gin.Default()
	router.Use(cors.Default())
	config := cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type"},
		AllowCredentials: true,
	}
	router.Use(cors.New(config))

	router.GET("/tasks", getTasks)
	router.POST("/tasks", createTask)
	router.GET("/tasks/:id", getTask)
	router.PUT("/tasks/:id", updateTask)
	router.DELETE("/tasks/:id", deleteTask)

	router.Run(":8080")
}

func getTasks(c *gin.Context) {
	tasks := []Task{}
	rows, err := db.Query("SELECT id, title, description, status FROM tasks")
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch tasks"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Status); err != nil {
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error reading tasks from database"})
			return
		}
		tasks = append(tasks, task)
	}
	c.IndentedJSON(http.StatusOK, tasks)
}

func createTask(c *gin.Context) {
	var newTask Task
	
	if err := c.BindJSON(&newTask); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	_, err := db.Exec("INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3)", newTask.Title, newTask.Description, newTask.Status)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Could not create task"})
		return
	}

	c.IndentedJSON(http.StatusCreated, newTask)
}

func getTask(c *gin.Context) {
	id := c.Param("id")
	var task Task
	row := db.QueryRow("SELECT id, title, description, status FROM tasks WHERE id = $1", id)
	err := row.Scan(&task.ID, &task.Title, &task.Description, &task.Status)
	if err != nil {
		if err == sql.ErrNoRows {
			c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		} else {
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch task"})
		}
		return
	}
	c.IndentedJSON(http.StatusOK, task)
}

func updateTask(c *gin.Context) {
	id := c.Param("id")
	var updatedTask Task
	if err := c.BindJSON(&updatedTask); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	_, err := db.Exec("UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4", updatedTask.Title, updatedTask.Description, updatedTask.Status, id)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Could not update task"})
		return
	}

	c.IndentedJSON(http.StatusOK, updatedTask)
}

func deleteTask(c *gin.Context) {
	id := c.Param("id")
	_, err := db.Exec("DELETE FROM tasks WHERE id = $1", id)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Could not delete task"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Task deleted"})
}