# Codex Task List

Use this as the practical task queue for building 3 Bit OS.

## Phase 1 - Make ternary work on normal computers

### Task 1 - Create project structure

Create folders:

- `src/`
- `tests/`
- `vm/`
- `kernel/`
- `tools/`
- `boot/`
- `docs/`

Add a basic build system.

### Task 2 - Build trit type

Create a `Trit` type with values:

- `-1`
- `0`
- `1`

Add tests.

### Task 3 - Build ternary word type

Create fixed-width ternary words.

Start with 9-trit words.

Add:

- Convert from decimal.
- Convert to decimal.
- Display as text.
- Parse from text.

### Task 4 - Build math

Add:

- Add
- Subtract
- Negate
- Compare

Add tests.

## Phase 2 - Build the ternary computer

### Task 5 - Create VM memory

Create ternary memory made of ternary words.

### Task 6 - Create registers

Add:

- `A`
- `B`
- `PC`
- `SP`
- `FLAGS`

### Task 7 - Create instruction enum

Start with:

- `NOP`
- `LOAD`
- `STORE`
- `MOV`
- `ADD`
- `SUB`
- `CMP`
- `JMP`
- `JZ`
- `JN`
- `JP`
- `OUT`
- `IN`
- `HALT`

### Task 8 - Execute hardcoded programs

Make the VM run a hardcoded instruction list.

Test with:

- Add two numbers.
- Print a value.
- Halt.

## Phase 3 - Make the OS

### Task 9 - Kernel image format

Create a simple way to load a kernel program into the VM.

### Task 10 - Basic kernel

Kernel should:

- Print boot message.
- Start shell.
- Accept input.

### Task 11 - Shell commands

Add:

- `help`
- `regs`
- `mem`
- `clear`
- `halt`

## Phase 4 - Make it bootable on laptop hardware

### Task 12 - Desktop runner

Create a host runner app first.

It should run on a normal OS and launch the ternary VM.

### Task 13 - QEMU image

Create a bootable disk image for testing in QEMU.

### Task 14 - UEFI host

Create a minimal x86_64 UEFI host that:

- Boots.
- Opens a framebuffer.
- Reads keyboard input.
- Runs the ternary VM.

### Task 15 - USB image

Create a bootable USB image.

Do not make a destructive installer yet.

## Phase 5 - Use real CPU and GPU better

### Task 16 - CPU optimization

Improve VM performance.

Possible work:

- Better trit packing.
- Less allocation.
- Faster instruction decode.
- Optional multi-threaded ternary processes.

### Task 17 - Basic GPU output

Use framebuffer graphics first.

Add:

- Draw pixel.
- Draw rectangle.
- Draw text.
- Clear screen.

### Task 18 - Storage

Add a simple file-like storage image.

Commands:

- `ls`
- `cat`
- `write`

## First task Codex should do now

Start with Phase 1, Task 1 through Task 4.

Do not start with bootloader, installer, GPU drivers, or hardware acceleration yet.
