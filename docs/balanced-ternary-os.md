# Balanced Ternary OS Design

This project is not meant to be a normal binary operating system at first. The goal is to design an experimental OS around balanced ternary values.

Balanced ternary uses three digit states:

- `-1`
- `0`
- `1`

A single ternary digit is called a trit. A group of trits can represent numbers, instructions, memory addresses, and data.

## Why balanced ternary

Balanced ternary can represent positive and negative numbers naturally because each digit can be negative, zero, or positive.

Example place values:

| Trits | Decimal |
|---|---:|
| `1` | 1 |
| `-1` | -1 |
| `10` | 3 |
| `1-1` | 2 |
| `-11` | -2 |

Each position is a power of 3.

From right to left:

- first trit: 1
- second trit: 3
- third trit: 9
- fourth trit: 27

So `1-10` means:

`1 * 9 + -1 * 3 + 1 * 0` would be wrong because the final trit has value 0, not a place value.

Correctly, `1-10` means:

`1 * 27 + -1 * 9 + 1 * 3 + 0 * 1 = 21`

## Practical implementation plan

Real computers are binary, so the first version should be a ternary virtual machine running on binary hardware.

The OS will run inside this VM. Later, the VM can become more realistic.

## Core layers

1. Ternary number library
2. Ternary virtual CPU
3. Ternary memory model
4. Ternary assembler
5. Tiny kernel
6. Shell
7. File-like storage

## Trit representation

In source code, represent one trit as an enum:

```c
typedef enum {
    TRIT_NEG = -1,
    TRIT_ZERO = 0,
    TRIT_POS = 1
} Trit;
```

A ternary word can be an array of trits.

Possible first word size: 9 trits.

9 trits gives `3^9 = 19683` possible states.

Balanced range:

`-9841` to `9841`

## CPU idea

The virtual CPU should use ternary words for registers.

Suggested first registers:

- `A` accumulator
- `B` general register
- `PC` program counter
- `SP` stack pointer
- `FLAGS` comparison state

## Instruction set idea

Use simple instructions first:

| Instruction | Meaning |
|---|---|
| `NOP` | Do nothing |
| `LOAD` | Load memory into register |
| `STORE` | Store register into memory |
| `ADD` | Add ternary values |
| `SUB` | Subtract ternary values |
| `CMP` | Compare values |
| `JMP` | Jump |
| `JZ` | Jump if zero |
| `JN` | Jump if negative |
| `JP` | Jump if positive |
| `HALT` | Stop CPU |

## Kernel goal

The first kernel should do only this:

1. Boot inside the ternary VM.
2. Print a welcome message.
3. Accept a tiny command.
4. Run commands like `help`, `mem`, `regs`, and `halt`.

## Important design choice

This should not pretend to be a normal x86 OS yet. It should be an experimental ternary OS simulator first. That makes the project possible on normal hardware while still using `-1`, `0`, and `1` as the main computing model.
