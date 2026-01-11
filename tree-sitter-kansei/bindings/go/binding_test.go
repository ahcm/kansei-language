package tree_sitter_kansei_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_kansei "github.com/ahcm/kansei-language/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_kansei.Language())
	if language == nil {
		t.Errorf("Error loading Kansei grammar")
	}
}
