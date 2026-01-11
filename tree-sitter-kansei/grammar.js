const PREC = {
  assign: 1,
  compare: 2,
  add: 3,
  multiply: 4,
  call: 5,
  member: 6,
};

module.exports = grammar({
  name: "kansei",

  extras: ($) => [/\s/, $.comment],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) => $._expression,

    _expression: ($) =>
      choice(
        $.assignment,
        $.if_expression,
        $.while_expression,
        $.for_expression,
        $.function_definition,
        $.yield_expression,
        $.binary_expression,
        $.call_expression,
        $.index_expression,
        $.member_access,
        $.array,
        $.map,
        $.closure_literal,
        $.reference,
        $.parenthesized_expression,
        $.identifier,
        $.integer,
        $.float,
        $.string,
        $.command,
        $.boolean
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
        field("consequence", $._block),
        repeat($.elif_clause),
        optional($.else_clause),
        "end"
      ),

    elif_clause: ($) =>
      seq("elif", field("condition", $._expression), field("consequence", $._block)),

    else_clause: ($) => seq("else", field("consequence", $._block)),

    while_expression: ($) =>
      seq(
        "while",
        field("condition", $._expression),
        field("body", $._block),
        "end"
      ),

    for_expression: ($) =>
      seq(
        "for",
        field("var", $.identifier),
        "in",
        field("iterable", $._expression),
        field("body", $._block),
        "end"
      ),

    function_definition: ($) =>
      seq(
        "fn",
        optional(field("name", $.identifier)),
        field("parameters", $.parameters),
        field("body", $._block),
        "end"
      ),

    parameters: ($) => seq("(", optional($.parameter_list), ")"),

    parameter_list: ($) => seq($.parameter, repeat(seq(",", $.parameter))),

    parameter: ($) => seq(optional("&"), $.identifier),

    yield_expression: ($) =>
      seq("yield", optional(choice($.arguments, $.argument_list))),

    call_expression: ($) =>
      prec.left(
        PREC.call,
        seq(
          field("function", $._expression),
          field("arguments", $.arguments),
          optional(field("block", $.block))
        )
      ),

    arguments: ($) => seq("(", optional($.argument_list), ")"),

    argument_list: ($) => seq($._expression, repeat(seq(",", $._expression))),

    block: ($) =>
      seq("{", optional($.block_parameters), field("body", $._block), "}"),

    block_parameters: ($) => seq("|", optional($.parameter_list), "|"),

    closure_literal: ($) =>
      seq("{", field("parameters", $.block_parameters), field("body", $._block), "}"),

    _block: ($) => repeat($._statement),

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
            seq($._expression, repeat(seq(",", $._expression)))
          )
        ),
        "]"
      ),

    map: ($) =>
      seq("{", optional(seq($.map_entry, repeat(seq(",", $.map_entry)))), "}"),

    map_entry: ($) =>
      seq(field("key", $._expression), ":", field("value", $._expression)),

    reference: ($) => seq("&", $.identifier),

    parenthesized_expression: ($) =>
      seq("(", optional($._expression), ")"),

    binary_expression: ($) =>
      choice(
        prec.left(
          PREC.compare,
          seq($._expression, choice("==", "!=", "<", ">"), $._expression)
        ),
        prec.left(PREC.add, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(
          PREC.multiply,
          seq($._expression, choice("*", "/"), $._expression)
        )
      ),

    boolean: () => choice("true", "false"),

    identifier: () => /[A-Za-z_][A-Za-z0-9_]*/,

    integer: () => /\d+/,

    float: () => /\d+\.\d+/,

    string: () => /"[^"\n]*"/,

    command: () => /`[^`\n]*`/,

    comment: () => /#[^\n]*/,
  },
});
