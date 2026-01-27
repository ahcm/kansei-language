Kansei-Language.pdf: LANGUAGE.md
	pandoc LANGUAGE.md -f gfm -o Kansei-Language.typ
	typst compile Kansei-Language.typ


