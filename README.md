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

## Laptop target

A real laptop will not run ternary instructions directly. The practical design is:

1. Boot a small binary host layer.
2. Start the balanced ternary VM.
3. Boot the 3 Bit OS ternary kernel inside the VM.
4. Use host services for screen, keyboard, storage, timers, and later hardware acceleration.

## Suggested milestones

1. Create the ternary number library.
2. Create the ternary CPU registers.
3. Add ternary memory.
4. Add a tiny instruction set.
5. Build a simple kernel loop.
6. Add a shell.
7. Add file-like storage.
8. Add a desktop runner.
9. Add an x86_64 UEFI host.
10. Add safe bootable QEMU and USB images.

## Design docs

Start here:

- `docs/balanced-ternary-os.md`
- `docs/codex-build-plan.md`
- `docs/codex-task-list.md`
- `docs/codex-implementation-log.md`

Versioned draft specs:

- `docs/specs/isa-v0.md`
- `docs/specs/hostabi-v0.md`
- `docs/specs/kernel-image-v0.md`
- `docs/specs/boot-modes.md`

## Notes for Codex

Keep changes small and explain low-level choices. Prefer simple, readable code over clever code.

Do not begin with GPU drivers, a destructive installer, networking, or POSIX compatibility. Build the ternary core and VM first.
