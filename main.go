package main

import (
	"io"
	"net/http"
	"os"

	"github.com/periaate/ftree"
)

func main() {
	if len(os.Args) < 2 {
		panic("No path specified")
	}
	p := os.Args[1]
	ft := ftree.FileTree{p}
	wk := ftree.NewWalker(ft)
	wk.AddStepper(Stepper)
}

type Server struct {
	// ...
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// ...
}

// Stepper is an interface used to act in place of fs.WalkDirFunc.
// To determine if a Stepper wants to read a file, the extension of a file
// is passed onto the want method.
type Stepper interface {
	// Walk is ran on each file in the FileTree.
	Walk(e ftree.Entry, r io.Reader) error
	// Given an extension, returns true if the Stepper wants to read the file.
	Wants(ext string) bool
}

type Sfn struct{}

func (s *Sfn) Walk(e ftree.Entry, r io.Reader) error {
	// ...
}

func (s *Sfn) Wants(ext string) bool {
	return ext == ".sfn"
}
