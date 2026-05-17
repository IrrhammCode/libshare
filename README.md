# Panduan Instalasi & Menjalankan LibShare

Berikut adalah panduan singkat cara memasang dan menjalankan aplikasi LibShare secara lokal.

---

## Prasyarat
Sebelum memulai, pastikan komputer Anda sudah terpasang:
*   Go (versi 1.20 ke atas)
*   Node.js (versi 18 ke atas)

---

## Cara Menjalankan Aplikasi

### 1. Menjalankan Back-End (Server Golang)
1.  Buka Terminal baru, lalu masuk ke direktori backend/:
    ```bash
    cd backend
    ```
2.  Sinkronisasikan dependensi Go:
    ```bash
    go tidy
    ```
3.  Jalankan server HTTP:
    ```bash
    go run main.go
    ```
    *Server backend akan mendengarkan request HTTP di alamat http://localhost:8080.*

---

### 2. Menjalankan Front-End (React + Vite)
1.  Buka Terminal baru terpisah, lalu masuk ke direktori frontend/:
    ```bash
    cd frontend
    ```
2.  Instal paket dependensi Node.js:
    ```bash
    npm install
    ```
3.  Jalankan aplikasi React:
    ```bash
    npm run dev
    ```
    *Aplikasi klien Anda akan terbuka secara otomatis di browser di alamat http://localhost:5173.*
