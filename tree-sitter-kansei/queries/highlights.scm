(comment) @comment
(string) @string
(command) @string.special
(integer) @number
(float) @number.float
(boolean) @boolean

[
  "fn"
  "if"
  "elif"
  "else"
  "end"
  "while"
  "for"
  "in"
  "yield"
] @keyword

(function_definition name: (identifier) @function)
(call_expression function: (identifier) @function.call)

(parameter (identifier) @variable.parameter)

(assignment left: (identifier) @variable)

((identifier) @function.builtin
  (#match? @function.builtin "^(puts|print|len|read_file|write_file)$"))
