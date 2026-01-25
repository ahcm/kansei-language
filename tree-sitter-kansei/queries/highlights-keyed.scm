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

(function_definition name: (identifier) @function)
(function_definition name: (member_access member: (identifier) @function))
(function_definition name: (module_access (identifier) @function))
(call_expression function: (identifier) @function.call)
(call_expression function: (member_access member: (identifier) @function.call))
(call_expression function: (module_access (identifier) @function.call))
(command_call method: (identifier) @function.call)

(parameter (identifier) @variable.parameter)

(assignment left: (identifier) @variable)

(struct_definition name: (identifier) @type)
(struct_field name: (identifier) @property)
(struct_literal type: (type_identifier) @type)
(struct_literal_field name: (identifier) @property)
(struct_pattern_field name: (identifier) @property)
(type_identifier (identifier) @type)
(type_identifier (module_access (identifier) @type))
(map_entry key: (string) @property)
(map_entry key: (identifier) @property)

((identifier) @function.builtin
  (#match? @function.builtin "^(puts|print|len|read_file|write_file)$"))
