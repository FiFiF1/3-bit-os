# ISA v0 Draft

Status: draft

This file defines the first balanced ternary instruction set target for Codex.

## Purpose

The ISA is for the ternary VM, not native laptop hardware.

The binary host executes the VM. The VM executes this ISA.

## Trits

A trit has one of three values:

- `-1`
- `0`
- `1`

Use the names:

- `N` for `-1`
- `Z` for `0`
- `P` for `1`

Text examples may also use `-`, `0`, and `+` when easier to read.

## Word size

Version 0 starts with 9-trit words for simple implementation.

A 9-trit balanced word has `3^9 = 19683` states.

Balanced integer range:

- minimum: `-9841`
- maximum: `9841`

The word size may change later, so code should avoid hardcoding `9` outside the spec constants.

## Registers

Required registers:

- `A` accumulator
- `B` general register
- `PC` program counter
- `SP` stack pointer
- `FLAGS` comparison/result flags

All registers are one ternary word in v0.

## Flags

`FLAGS` should be able to represent:

- negative
- zero
- positive
- halted
- trap/error

Exact bit/trit layout is not frozen yet. Codex should document the chosen layout before implementation.

## Memory

Memory is an indexed array of ternary words.

Addresses are non-negative ternary word values.

Invalid memory access traps through the host ABI.

## Minimum instructions

| Instruction | Meaning |
|---|---|
| `NOP` | Do nothing |
| `LOAD R, addr` | Load memory into register |
| `STORE R, addr` | Store register into memory |
| `MOV dst, src` | Copy register or immediate |
| `ADD dst, src` | Add into destination |
| `SUB dst, src` | Subtract from destination |
| `NEG R` | Negate register |
| `CMP lhs, rhs` | Set flags from comparison |
| `JMP addr` | Unconditional jump |
| `JZ addr` | Jump if zero |
| `JN addr` | Jump if negative |
| `JP addr` | Jump if positive |
| `PUSH R` | Push register to stack |
| `POP R` | Pop stack into register |
| `CALL addr` | Push return address and jump |
| `RET` | Return from call |
| `TRAP id` | Call host service |
| `HALT` | Stop the VM |

## Execution rule

VM loop:

1. Fetch instruction at `PC`.
2. Increment `PC` unless instruction changes it.
3. Execute instruction.
4. Update flags if required.
5. Stop on `HALT` or fatal trap.

## Errors

Errors must be explicit.

Initial errors:

- invalid opcode
- invalid register
- memory out of range
- stack underflow
- stack overflow
- divide by zero if division is added later
- host trap failure

## Acceptance tests

Codex should add golden tests for:

- decimal to ternary conversion
- ternary to decimal conversion
- addition
- subtraction
- comparison
- jumps
- trap dispatch
- halt
