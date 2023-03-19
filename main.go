package main

import (
	"encoding/json"
	"errors"
	"io/fs"
	"log"
	"net/http"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatalln(errors.New("missing path: fser <path>"))
	}

	mux := http.NewServeMux()
	fileList := []string{}

	vfs := os.DirFS(os.Args[1])
	fserfs := http.FS(vfs)
	staticfs := http.FS(os.DirFS("static"))

	fs.WalkDir(vfs, ".", func(path string, d os.DirEntry, err error) error {
		if err != nil || d.IsDir() {
			return err
		}
		fileList = append(fileList, path)
		return nil
	})

	sh := http.FileServer(staticfs)
	mux.Handle("/", sh)
	mux.Handle("/static/", http.StripPrefix("/static", sh))
	mux.Handle("/fs/", http.StripPrefix("/fs", http.FileServer(fserfs)))
	mux.HandleFunc("/list/", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(fileList)
	})

	log.Println("Welcome! Fser is running on http://localhost:8080/")
	http.ListenAndServe("localhost:8080", mux)
}
