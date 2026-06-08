// Author: Irham Muhammad Hamzah
// Program: Arsitektur Komputasi Awan - Tugas 11

package main

import (
	"encoding/json"
	"net/http"
	"os"
	"sync"

	"github.com/gin-gonic/gin"
)

// === ENTITY STRUCTURES (Tugas 9 & 10) ===

type Book struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Author string `json:"author"`
	Status string `json:"status"` // Available, On Loan
}

type Member struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	JoinDate string `json:"join_date"`
}

type Loan struct {
	ID       string `json:"id"`
	BookID   string `json:"book_id"`
	MemberID string `json:"member_id"`
	LoanDate string `json:"loan_date"`
	DueDate  string `json:"due_date"`
	Status   string `json:"status"` // On Loan, Returned, Overdue
}

// Memory Storage & Mutex untuk menghindari race condition
var (
	books   = []Book{}
	members = []Member{}
	loans   = []Loan{}
	mu      sync.Mutex
)

func main() {
	r := gin.Default()

	// Middleware CORS agar Frontend Vite (Port 5173) bisa mengakses Backend (Port 8080) via HTTP
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	// Load data awal dari file JSON saat server menyala
	loadData()

	// === REST API ENDPOINTS (HTTP Protocol) ===

	// --- 1. MANAGE BOOKS FEATURE ---
	r.GET("/api/books", func(c *gin.Context) {
		c.JSON(http.StatusOK, books)
	})

	r.POST("/api/books", func(c *gin.Context) {
		var newBook Book
		if err := c.ShouldBindJSON(&newBook); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		mu.Lock()
		if newBook.Status == "" {
			newBook.Status = "Available"
		}
		books = append(books, newBook)
		saveData("data/books.json", books)
		mu.Unlock()
		c.JSON(http.StatusCreated, newBook)
	})

	r.PUT("/api/books/:id", func(c *gin.Context) {
		id := c.Param("id")
		var updatedBook Book
		if err := c.ShouldBindJSON(&updatedBook); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		mu.Lock()
		defer mu.Unlock()
		for i, b := range books {
			if b.ID == id {
				books[i] = updatedBook
				saveData("data/books.json", books)
				c.JSON(http.StatusOK, updatedBook)
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
	})

	r.DELETE("/api/books/:id", func(c *gin.Context) {
		id := c.Param("id")
		mu.Lock()
		defer mu.Unlock()
		for i, b := range books {
			if b.ID == id {
				books = append(books[:i], books[i+1:]...)
				saveData("data/books.json", books)
				c.JSON(http.StatusOK, gin.H{"message": "Book deleted successfully"})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
	})

	// --- 2. MEMBER REGISTRATION FEATURE ---
	r.GET("/api/members", func(c *gin.Context) {
		c.JSON(http.StatusOK, members)
	})

	r.POST("/api/members", func(c *gin.Context) {
		var newMember Member
		if err := c.ShouldBindJSON(&newMember); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		mu.Lock()
		members = append(members, newMember)
		saveData("data/members.json", members)
		mu.Unlock()
		c.JSON(http.StatusCreated, newMember)
	})

	r.PUT("/api/members/:id", func(c *gin.Context) {
		id := c.Param("id")
		var updatedMember Member
		if err := c.ShouldBindJSON(&updatedMember); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		mu.Lock()
		defer mu.Unlock()
		for i, m := range members {
			if m.ID == id {
				members[i] = updatedMember
				saveData("data/members.json", members)
				c.JSON(http.StatusOK, updatedMember)
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
	})

	r.DELETE("/api/members/:id", func(c *gin.Context) {
		id := c.Param("id")
		mu.Lock()
		defer mu.Unlock()
		for i, m := range members {
			if m.ID == id {
				members = append(members[:i], members[i+1:]...)
				saveData("data/members.json", members)
				c.JSON(http.StatusOK, gin.H{"message": "Member deleted successfully"})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
	})

	// --- 3. LOAN MANAGEMENT FEATURE ---
	r.GET("/api/loans", func(c *gin.Context) {
		c.JSON(http.StatusOK, loans)
	})

	r.POST("/api/loans", func(c *gin.Context) {
		var newLoan Loan
		if err := c.ShouldBindJSON(&newLoan); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		mu.Lock()
		defer mu.Unlock()

		// Ubah status buku menjadi 'On Loan'
		for i, b := range books {
			if b.ID == newLoan.BookID {
				books[i].Status = "On Loan"
				break
			}
		}

		if newLoan.Status == "" {
			newLoan.Status = "On Loan"
		}

		loans = append(loans, newLoan)
		saveData("data/loans.json", loans)
		saveData("data/books.json", books)

		c.JSON(http.StatusCreated, newLoan)
	})

	r.PUT("/api/loans/:id", func(c *gin.Context) {
		id := c.Param("id")
		var updatedLoan Loan
		if err := c.ShouldBindJSON(&updatedLoan); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		mu.Lock()
		defer mu.Unlock()

		for i, l := range loans {
			if l.ID == id {
				// Jika status berubah dari 'On Loan' menjadi 'Returned', ubah status buku menjadi 'Available'
				if l.Status == "On Loan" && updatedLoan.Status == "Returned" {
					for j, b := range books {
						if b.ID == l.BookID {
							books[j].Status = "Available"
							break
						}
					}
				}
				loans[i] = updatedLoan
				saveData("data/loans.json", loans)
				saveData("data/books.json", books)
				c.JSON(http.StatusOK, updatedLoan)
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Loan not found"})
	})

	r.DELETE("/api/loans/:id", func(c *gin.Context) {
		id := c.Param("id")
		mu.Lock()
		defer mu.Unlock()
		for i, l := range loans {
			if l.ID == id {
				// Jika peminjaman yang dihapus masih berstatus 'On Loan', kembalikan buku menjadi 'Available'
				if l.Status == "On Loan" {
					for j, b := range books {
						if b.ID == l.BookID {
							books[j].Status = "Available"
							break
						}
					}
				}
				loans = append(loans[:i], loans[i+1:]...)
				saveData("data/loans.json", loans)
				saveData("data/books.json", books)
				c.JSON(http.StatusOK, gin.H{"message": "Loan deleted successfully"})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Loan not found"})
	})

	// Jalankan server di port yang dikonfigurasi (IaaS Internal Backend)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}

// === HELPER FUNCTIONS UNTUK PERSISTENSI JSON ===

func loadData() {
	bData, _ := os.ReadFile("data/books.json")
	json.Unmarshal(bData, &books)

	mData, _ := os.ReadFile("data/members.json")
	json.Unmarshal(mData, &members)

	lData, _ := os.ReadFile("data/loans.json")
	json.Unmarshal(lData, &loans)
}

func saveData(filename string, data interface{}) {
	file, _ := json.MarshalIndent(data, "", "  ")
	_ = os.WriteFile(filename, file, 0644)
}
