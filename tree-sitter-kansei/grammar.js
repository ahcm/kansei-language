const PREC = {
  assign: 1,
  or: 2,
  and: 3,
  compare: 4,
  add: 5,
  multiply: 6,
  unary: 7,
  call: 8,
  member: 9,
};

module.exports = grammar({
  name: "kansei",

  extras: ($) => [/\s/, $.comment],

  word: ($) => $.identifier,

  conflicts: ($) => [
    [$._expression, $.type_identifier],
    [$._expression, $.function_name],
    [$.parameters, $.parenthesized_expression],
    [$.arguments, $.parenthesized_expression],
    [$.argument_list, $.parenthesized_expression],
    [$._expression, $.parameter],
    [$.parameter, $.type_identifier],
    [$.parameter, $.reference],
    [$.use_statement, $.visibility_modifier],
    [$.import_statement, $.visibility_modifier],
    [$.load_statement, $.visibility_modifier],
  ],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.use_statement,
        $.import_statement,
        $.load_statement,
        $.export_statement,
        $.struct_definition,
        $.visibility_modifier,
        $._expression
      ),

    _expression: ($) =>
      choice(
        $.assignment,
        $.if_expression,
        $.while_expression,
        $.for_expression,
        $.loop_expression,
        $.function_definition,
        $.yield_expression,
        $.binary_expression,
        $.unary_expression,
        $.call_expression,
        $.command_call,
        $.index_expression,
        $.member_access,
        $.module_access,
        $.array,
        $.map,
        $.env_literal,
        $.struct_literal,
        $.closure_literal,
        $.reference,
        $.parenthesized_expression,
        $.identifier,
        $.integer,
        $.float,
        $.string,
        $.format_string,
        $.command,
        $.boolean,
        $.nil
      ),

    assignment: ($) =>
      prec.right(
        PREC.assign,
        seq(
          field("left", $.assignment_target),
          "=",
          field("right", $._expression)
        )
      ),

    assignment_target: ($) =>
      choice($.identifier, $.member_access, $.index_expression),

    if_expression: ($) =>
      seq(
        "if",
        field("condition", $._expression),
        field("consequence", optional($._block)),
        repeat($.elif_clause),
        optional($.else_clause),
        "end"
      ),

    elif_clause: ($) =>
      seq(
        "elif",
        field("condition", $._expression),
        field("consequence", optional($._block))
      ),

    else_clause: ($) => seq("else", field("consequence", optional($._block))),

    while_expression: ($) =>
      seq(
        "while",
        field("condition", $._expression),
        field("body", optional($._block)),
        "end"
      ),

    for_expression: ($) =>
      seq(
        "for",
        field("var", $.identifier),
        "in",
        field("iterable", $._expression),
        field("body", optional($._block)),
        "end"
      ),

    loop_expression: ($) =>
      seq(
        "loop",
        field("count", $._expression),
        optional(field("index", $.loop_index)),
        field("body", optional($._block)),
        "end"
      ),

    loop_index: ($) => seq("|", $.identifier, "|"),

    function_definition: ($) =>
      seq(
        "fn",
        optional(field("name", $.function_name)),
        field("parameters", $.parameters),
        field("body", optional($._block)),
        "end"
      ),

    function_name: ($) =>
      choice($.identifier, $.member_access, $.module_access),

    parameters: ($) => seq("(", optional($.parameter_list), ")"),

    parameter_list: ($) => seq($.parameter, repeat(seq(",", $.parameter))),

    parameter: ($) =>
      seq(
        optional("&"),
        $.identifier,
        optional(choice(seq(":", $.type_identifier), $.struct_pattern))
      ),

    yield_expression: ($) =>
      prec.right(PREC.call, seq("yield", optional($.arguments))),

    call_expression: ($) =>
      prec.left(
        PREC.call,
        seq(
          field("function", $._expression),
          field("arguments", $.arguments),
          optional(field("block", $.block))
        )
      ),

    command_call: ($) =>
      prec.left(
        PREC.call,
        seq(
          field("receiver", $._expression),
          field("method", $.identifier),
          optional(field("arguments", $.arguments)),
          optional(field("block", $.block))
        )
      ),

    arguments: ($) => seq("(", optional($.argument_list), ")"),

    argument_list: ($) => seq($._expression, repeat(seq(",", $._expression))),

    block: ($) =>
      seq("{", optional($.block_parameters), field("body", optional($._block)), "}"),

    block_parameters: ($) => seq("|", optional($.parameter_list), "|"),

    closure_literal: ($) =>
      seq(
        "{",
        field("parameters", $.block_parameters),
        field("body", optional($._block)),
        "}"
      ),

    _block: ($) => repeat1($._statement),

    index_expression: ($) =>
      prec.left(
        PREC.call,
        seq(
          field("target", $._expression),
          "[",
          field("index", $._expression),
          "]"
        )
      ),

    member_access: ($) =>
      prec.left(
        PREC.member,
        seq(field("target", $._expression), ".", field("member", $.identifier))
      ),

    array: ($) =>
      seq(
        "[",
        optional(
          choice(
            seq(field("generator", $._expression), ";", field("size", $._expression)),
            seq($._expression, repeat(seq(",", $._expression)), optional(","))
          )
        ),
        "]"
      ),

    map: ($) =>
      seq("{", optional($.map_entry_list), "}"),

    map_entry_list: ($) =>
      seq($.map_entry, repeat(seq(",", $.map_entry)), optional(",")),

    map_entry: ($) =>
      seq(field("key", choice($.string, $.identifier)), ":", field("value", $._expression)),

    env_literal: ($) =>
      seq("%{", optional($.map_entry_list), "}"),

    struct_definition: ($) =>
      seq(
        "struct",
        field("name", $.identifier),
        field("body", $.struct_body)
      ),

    struct_body: ($) => seq("{", optional($.struct_field_list), "}"),

    struct_field_list: ($) =>
      seq($.struct_field, repeat(seq(",", $.struct_field)), optional(",")),

    struct_field: ($) =>
      seq(field("name", $.identifier), ":", field("type", $.type_identifier)),

    struct_literal: ($) =>
      seq(
        field("type", $.type_identifier),
        field("body", $.struct_literal_body)
      ),

    struct_literal_body: ($) => seq("{", optional($.struct_literal_field_list), "}"),

    struct_literal_field_list: ($) =>
      seq($.struct_literal_field, repeat(seq(",", $.struct_literal_field)), optional(",")),

    struct_literal_field: ($) =>
      seq(field("name", $.identifier), ":", field("value", $._expression)),

    struct_pattern: ($) => seq("{", optional($.struct_pattern_field_list), "}"),

    struct_pattern_field_list: ($) =>
      seq($.struct_pattern_field, repeat(seq(",", $.struct_pattern_field)), optional(",")),

    struct_pattern_field: ($) =>
      seq(field("name", $.identifier), ":", field("type", $.type_identifier)),

    type_identifier: ($) => choice($.identifier, $.module_access),

    module_access: ($) =>
      prec.left(
        PREC.member,
        seq($.identifier, repeat1(seq("::", $.identifier)))
      ),

    reference: ($) => seq("&", $.identifier),

    parenthesized_expression: ($) =>
      seq("(", optional($._expression), ")"),

    binary_expression: ($) =>
      choice(
        prec.left(
          PREC.or,
          seq($._expression, choice("or", "||"), $._expression)
        ),
        prec.left(
          PREC.and,
          seq($._expression, choice("and", "&&"), $._expression)
        ),
        prec.left(
          PREC.compare,
          seq($._expression, choice("==", "!=", "<", ">", "<=", ">="), $._expression)
        ),
        prec.left(PREC.add, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(
          PREC.multiply,
          seq($._expression, choice("*", "/"), $._expression)
        )
      ),

    unary_expression: ($) =>
      prec(
        PREC.unary,
        seq(choice("not", "-", "%"), field("argument", $._expression))
      ),

    boolean: () => choice("true", "false"),

    nil: () => "nil",

    use_statement: ($) =>
      seq(optional($.visibility_prefix), "use", field("module", $.module_access)),

    import_statement: ($) =>
      seq(
        optional($.visibility_prefix),
        "import",
        field("path", $.string),
        optional(seq("as", field("alias", $.identifier)))
      ),

    load_statement: ($) =>
      seq(optional($.visibility_prefix), "load", field("module", $.module_access)),

    export_statement: ($) =>
      seq(
        "export",
        field("module", $.module_access),
        "::",
        field("exports", $.export_list)
      ),

    export_list: ($) =>
      seq("[", optional($.export_list_items), "]"),

    export_list_items: ($) =>
      seq($.identifier, repeat(seq(",", $.identifier)), optional(",")),

    visibility_modifier: ($) => $.visibility_prefix,

    visibility_prefix: () => choice("@file", "@function"),

    identifier: () => /[A-Za-z_][A-Za-z0-9_]*/,

    integer: () => /\d+(i(32|64|128)|u(32|64|128))?/,

    float: () => /\d+\.\d+(f(32|64|128))?/,

    string: () => /"([^"\\\n]|\\.)*"/,

    format_string: () => /f"([^"\\\n]|\\.)*"/,

    command: () => /`[^`\n]*`/,

    comment: () => /#[^\n]*/,
  },
});
