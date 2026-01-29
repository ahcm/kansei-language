(comment) @comment
(string) @string
(format_string) @string.special
(command) @string.special
(integer) @number
(float) @number.float
(boolean) @boolean
(nil) @constant.builtin

[
  "fn"
  "if"
  "elif"
  "else"
  "end"
  "while"
  "for"
  "in"
  "loop"
  "yield"
  "struct"
  "use"
  "import"
  "export"
  "load"
  "as"
  "and"
  "or"
  "not"
  "@file"
  "@function"
] @keyword

(function_definition (function_name (identifier) @function))
(function_definition (function_name (member_access (identifier) (identifier) @function)))
(function_definition (function_name (module_access) @function))
(call_expression (identifier) @function.call (arguments))
(call_expression (member_access (identifier) (identifier) @function.call) (arguments))
(call_expression (module_access) @function.call (arguments))
(command_call _ (identifier) @function.call)

(parameter (identifier) @variable.parameter)

(assignment (assignment_target (identifier) @variable))

(struct_definition (identifier) @type)
(struct_field (identifier) @property)
(struct_literal (type_identifier) @type)
(struct_literal_field (identifier) @property)
(struct_pattern_field (identifier) @property)
(type_identifier (identifier) @type)
(type_identifier (module_access) @type)
(map_entry (string) @string)
(map_entry (identifier) @property)

((identifier) @function.builtin
  (#match? @function.builtin "^(puts|print|len|read_file|write_file)$"))
