# 3 Bit OS

An experimental balanced ternary operating system project.

Instead of building around binary digits, this project is based on trits with three possible values:

- `-1`
- `0`
- `1`

Because normal computers are binary, the first version should be a balanced ternary virtual machine plus a tiny OS that runs inside it.

## Goal

Build a tiny educational OS that uses balanced ternary as its main computing model.

## First target

Make a ternary virtual machine that can:

1. Store trits and ternary words.
2. Convert between decimal and balanced ternary.
3. Run simple ternary CPU instructions.
4. Boot a tiny kernel.
5. Show a basic shell with commands like `help`, `regs`, `mem`, and `halt`.

## Suggested milestones

1. Create the ternary number library.
2. Create the ternary CPU registers.
3. Add ternary memory.
4. Add a tiny instruction set.
5. Build a simple kernel loop.
6. Add a shell.
7. Add file-like storage.

## Design docs

See `docs/balanced-ternary-os.md` for the main design direction.

## Notes for Codex

Keep changes small and explain low-level choices. Prefer simple, readable code over clever code.
