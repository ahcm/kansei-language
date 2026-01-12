# Kansei Language Reference

Kansei to be an intuitive scripting language designed for simplicity and flexibility.
Inspired by Ruby 1.8 and functional programming.

## Comments
```ruby
# This is a comment
x = 10 # Inline comment
```

## Data Types

### Primitives
- **Integer**: `1`, `42`, `-10`
  - Default integer literals are `i64`.
  - Use suffixes like `1i32`, `1i64`, `1i128` for signed sizes.
  - Use suffixes like `1u32`, `1u64`, `1u128` for unsigned sizes.
- **Float**: `1.0`, `3.14`, `-0.01`
  - Default float literals are `f64`.
  - Use suffixes like `1.0f32`, `1.0f64`, `1.0f128` to pick other float sizes.
- **String**: `"Hello"`, `"World"`
- **Boolean**: `true`, `false`
- **Nil**: `nil`

### Data Structures
Arrays and Maps are **mutable** and use **reference semantics**. Assigning an array/map to a new variable does not copy it; both variables point to the same data.

- **Array**: Ordered list of values.
  ```ruby
  a = [1, 2, 3]
  first = arr[0]
  
  # Modification
  arr[0] = 10

  # Initialization with size and value
  zeros = [0; 10]

  # Initialization with generator function
  evens = [fn(i) i * 2 end; 5] # [0, 2, 4, 6, 8]
  evens = [{|i| i * 2 }; 5] # same

  a = [1, 2, 3]
  a each  { |i| i + 1 } # [2, 3, 4]
  a apply { |i| i + 1 } # [1, 2, 3] original input
  ```
- **Map**: Key-value pairs (keys are strings).
  ```ruby
  user = {"name": "Alice", "age": 30}
  name = user["name"]
  
  # Modification
  user["age"] = 31
  user.age = 32 # Dot syntax works for assignment too

  keys = user keys
  values = user values

  # Iterate
  h = {"a": 1, "b": 2}
  h keys each { |k, &h| h[k] = h[k] + 1 }  # [2, 3]
  h keys apply { |k, &h| h[k] = h[k] + 1 } # ["a", "b"] original input
  ```
Use `each` or `apply` with blocks to iterate. `each` returns an array of block results, while `apply` is for side effects and returns the original collection.

### Dot Syntax
Maps can be accessed and modified using dot notation if the key is a valid identifier.
```ruby
user = {"name": "Alice"}
user.name = "Bob"
```

## Program Arguments
Command-line arguments are available via the global `program` object.
```ruby
# The name of the executable (args[0])
name = program.name

# The script arguments
args = program.args
puts args[0] # "arg1"
```

### Environment Variables
Environment variables are available via `program.env`.
```ruby
home = program.env.HOME
```

## Modules and `use`
Kansei exposes native modules via the `std` namespace. The `use` keyword validates that a module path exists but does not create local bindings. Use assignment to alias.

```ruby
use std::Int64
use std::Int128
use std::Uint64
use std::Uint128
use std::Float32
use std::Float64
use std::Float128

Int64 = std::Int64
value = Int64.parse("42")
Int128 = std::Int128
big_int = Int128.parse("9007199254740993")
Uint64 = std::Uint64
u = Uint64.parse("42")
Float32 = std::Float32
f = Float32.parse("1.25")
root32 = Float32.sqrt(9)
Float64 = std::Float64
pi = Float64.parse("3.14159")
root64 = Float64.sqrt(9)
Float128 = std::Float128
big = Float128.parse("1.2345678901234567")
root128 = Float128.sqrt(9)
```

The `::` operator accesses module members, similar to map dot access.

## Variables
Variables are dynamically typed and defined on assignment.
```ruby
x = 10
x = "Now a string"
```

## Operators
- Arithmetic: `+`, `-`, `*`, `/`
- Comparison: `==`, `!=`, `<`, `>`
- String Concatenation: `"Hello " + "World"`

## Control Flow

### If / Else
```ruby
if x < 10
  puts "Less than 10"
elif x == 10
  puts "Equal to 10"
else
  puts "Greater than 10"
end
```

### While Loop
```ruby
while x > 0
  x = x - 1
end
```

### Loop
`loop` repeats a fixed number of times. You can optionally name the index variable.

```ruby
loop 3
  puts "hi"
end

loop 10 |i|
  puts i
end
```

### For Loop
Iterates over Arrays (values) or Maps (keys).
```ruby
for item in [1, 2, 3]
  puts item
end
```

## Functions
Functions are first-class citizens.
By default, functions do not implicitly capture outer variables.
Explicit reference capture using & is required to access or modify outer bindings.

### Definition
```ruby
fn add(a, b)
  a + b # Implicit return of last expression
end
```

### Calling
```ruby
res = add(1, 2)
```

### Anonymous Functions
Functions can be defined without a name and passed as values.
```ruby
# Using 'fn' keyword
double = fn(x) x * 2 end

# Using block syntax (Closure literal)
triple = {|x| x * 3}

res = double(5)
```

### Currying
Functions support partial application (currying) by default.
```ruby
add10 = add(10) # Returns a new function that takes 1 argument
res = add10(5)  # Returns 15
```

## Blocks and Yield
Functions can accept a block of code using `{ |params| ... }`. The function can execute this block using `yield`.

```ruby
fn repeater(n)
  loop n
    yield(i)
  end
end

repeater(3) { |idx|
  puts "Index: " + idx
}
```

## Variable Scope and References

Kansei enforces strict variable scoping to prevent accidental modification of outer variables.

### Implicit Shadowing
Assigning to a variable inside a function or block creates a new local variable, shadowing any outer variable of the same name. Implicit access to outer variables for reading is also restricted in many contexts to ensure isolation.

```ruby
x = 10
fn f()
  x = 20 # Defines a local 'x', does not modify outer 'x'
end
f()
# x is still 10
```

### Reference Capture (`&`)
To modify an outer variable or pass a variable by reference, you must use the `&` operator in both the parameter definition and the call site (for functions) or capture list (for blocks).

#### Functions
```ruby
fn increment(&val)
  val = val + 1
end

count = 0
increment(&count) # Explicit reference passing
# count is now 1
```

#### Blocks
Blocks passed to functions can also capture outer variables by reference.

```ruby
sum = 0
[1, 2, 3].each { |val, &sum|
  sum = sum + val
}
```

## Built-in Functions
- `puts(val)`: Print value with newline.
- `print(val)`: Print value without newline.
- `len(obj)`: Return length of String, Array, or Map.
- `read_file(path)`: Read file content as string.
- `write_file(path, content)`: Write string to file.

## Format Strings
Prefix a string with `f` to interpolate expressions, similar to Rust formatting.

```ruby
name = "Ada"
count = 3
pi = 3.14159
msg = f"{name} has {count} items"
short_pi = f"{pi:.2}"
```

Use `{{` and `}}` to include literal braces. Precision formatting uses `{expr:.N}`.

## WASM Modules
Use `load wasm::name` to load a WebAssembly module from `wasm/name.wasm`. The module is exposed under the `wasm` namespace.

```ruby
load wasm::Json
Json = wasm.json
result = Json.parse(f"{1 + 2}")
```

### WASM ABI
- Export a `memory` and an `alloc(size: i32) -> i32`. `dealloc(ptr: i32, len: i32)` is optional.
- For wasm-bindgen modules, `__wbindgen_malloc(size: i32, align: i32) -> i32`, `__wbindgen_free(ptr: i32, len: i32, align: i32)`, and `__wbindgen_add_to_stack_pointer(delta: i32) -> i32` are used when present.
- String arguments are passed as `(i32 ptr, i32 len)` in UTF-8.
- Numeric arguments map to `i32/i64/f32/f64`.
- For string returns, export functions ending with `_str` and return an `i64` where the low 32 bits are `ptr` and high 32 bits are `len` (both `u32`). The host reads from `memory`.
- For wasm-bindgen-style exports that include an initial `i32` retptr parameter (e.g. params are `retptr, ptr, len` and results are `[]` or `[i32]`), the host allocates 8 bytes for `(ptr, len)`, passes that retptr as the first argument, reads the returned `(ptr, len)` from memory, and frees the returned buffer with `dealloc`/`__wbindgen_free` after copying into a Kansei string.

## Shell Commands
Backticks execute shell commands and capture stdout (trimmed).
```ruby
files = `ls -la`
puts files
```
