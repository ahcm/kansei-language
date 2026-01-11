# Kansei Language Reference

Kansei is an intuitive scripting language designed for simplicity and flexibility.

## Comments
```ruby
# This is a comment
x = 10 # Inline comment
```

## Data Types

### Primitives
- **Integer**: `1`, `42`, `-10`
- **Float**: `1.0`, `3.14`, `-0.01`
- **String**: `"Hello"`, `"World"`
- **Boolean**: `true`, `false`
- **Nil**: `nil`

### Data Structures
Arrays and Maps are **mutable** and use **reference semantics**. Assigning an array/map to a new variable does not copy it; both variables point to the same data.

- **Array**: Ordered list of values.
  ```ruby
  arr = [1, 2, 3]
  first = arr[0]
  
  # Modification
  arr[0] = 10

  # Initialization with size and value
  zeros = [0; 10]

  # Initialization with generator function
  evens = [fn(i) i * 2 end; 5] # [0, 2, 4, 6, 8]
  ```
- **Map**: Key-value pairs (keys are strings).
  ```ruby
  user = {"name": "Alice", "age": 30}
  name = user["name"]
  
  # Modification
  user["age"] = 31
  user.age = 32 # Dot syntax works for assignment too
  ```

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

### For Loop
Iterates over Arrays (values) or Maps (keys).
```ruby
for item in [1, 2, 3]
  puts item
end
```

## Functions
Functions are first-class citizens. They capture their definition environment (closures).

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
  i = 0
  while i < n
    yield(i)
    i = i + 1
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

## Shell Commands
Backticks execute shell commands and capture stdout (trimmed).
```ruby
files = `ls -la`
puts files
```