# Kansei language

Kansei (感性) is a language based on Rust in the spirit of Ruby 1.8 with a more functional flavour.

The current reference implementation is a little faster than mruby.

This repository is for documenting the language.

See [Language](LANGUAGE.md).

It supports currying:
```
fn add(x, y)
  x + y
end

add10 = add(10)

puts "Add 10 to 5: " + add10(5)
```
---
Have fun and may the force be with you!

-- Andreas Hauser, München, 8.1.2026
