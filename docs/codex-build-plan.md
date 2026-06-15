# Codex Build Plan

This document explains what Codex should build and in what order.

## Big reality check

Modern laptops use binary CPUs, binary memory, binary buses, and binary GPUs. A real laptop cannot directly execute `-1`, `0`, and `1` trits in hardware unless custom ternary hardware exists.

So the practical plan is:

1. Build a normal bootable binary host layer for x86_64 laptops.
2. Inside that host layer, run a balanced ternary virtual machine.
3. Build the actual 3 Bit OS kernel for that ternary virtual machine.
4. Use real CPU cores through the host layer.
5. Use real GPU hardware through staged drivers or a framebuffer first.

This makes the project possible on real laptops while keeping the OS design based on balanced ternary.

## Final target

A laptop should be able to boot from a USB drive into 3 Bit OS.

The first real hardware version should:

- Boot on common x86_64 UEFI laptops.
- Show text or simple graphics on screen.
- Accept keyboard input.
- Run a balanced ternary VM.
- Boot a ternary kernel inside the VM.
- Provide a shell.
- Use CPU time efficiently enough to feel responsive.
- Use GPU output at least as a framebuffer.

## Development stages

### Stage 0 - Repo foundation

Codex should create:

- `docs/`
- `src/`
- `tests/`
- `tools/`
- `kernel/`
- `vm/`
- `boot/`
- `build/` ignored by git

Preferred implementation language for the first version: Rust or C.

Rust is safer for OS work, but C is easier for very low-level tutorials. Pick one and document the choice.

### Stage 1 - Balanced ternary core

Build a ternary math library before any OS work.

Needed features:

- `Trit` type with values `-1`, `0`, `1`.
- `TWord` type for fixed-width ternary words.
- Decimal to balanced ternary conversion.
- Balanced ternary to decimal conversion.
- Add, subtract, negate, compare.
- Unit tests for all conversions and math.

This can run as a normal desktop program first.

### Stage 2 - Ternary virtual CPU

Create a virtual CPU that uses ternary words internally.

Minimum registers:

- `A` accumulator
- `B` general purpose register
- `PC` program counter
- `SP` stack pointer
- `FLAGS`

Minimum instructions:

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
- `PUSH`
- `POP`
- `CALL`
- `RET`
- `OUT`
- `IN`
- `HALT`

Codex should make the CPU executable as a normal test program before trying to boot on real hardware.

### Stage 3 - Ternary assembler

Create a simple assembler that turns readable assembly into VM bytecode or tritcode.

Example syntax:

```asm
LOAD A, message
OUT A
HALT
```

The assembler should support:

- Labels
- Constants
- Comments
- Basic error messages
- Output file generation

### Stage 4 - Ternary kernel

Create a small ternary kernel that runs inside the VM.

First kernel features:

- Boot message
- Basic output system call
- Keyboard input system call
- Shell loop
- Commands:
  - `help`
  - `regs`
  - `mem`
  - `clear`
  - `halt`

The kernel is the real 3 Bit OS. The binary host layer is only there so laptops can run it.

### Stage 5 - Desktop host runner

Before booting on hardware, create a normal app that runs the VM on Windows, Linux, or macOS.

This runner should:

- Load a ternary kernel image.
- Run the VM.
- Display output in a terminal window.
- Accept keyboard input.
- Print CPU stats.

This gives Codex something easy to test.

### Stage 6 - Bootable x86_64 host

Create a tiny x86_64 UEFI bootable host.

The host should:

- Boot from UEFI.
- Initialize screen output using GOP framebuffer.
- Initialize keyboard input.
- Load or embed the ternary VM.
- Load or embed the ternary kernel image.
- Start the VM.

This is the point where it becomes installable or USB bootable.

### Stage 7 - Installer

First installer should be simple and safe.

Do not overwrite the user's main drive at first.

Safer first targets:

- Create a bootable USB image.
- Create a disk image for QEMU.
- Create an ISO if the boot path supports it.

Later installer features:

- Detect disks.
- Warn before writing.
- Create a 3 Bit OS partition.
- Install boot files.
- Add UEFI boot entry.

### Stage 8 - CPU utilization

The OS cannot directly run ternary instructions on the CPU. The binary host executes the VM.

Codex should optimize the VM by:

- Using efficient trit packing.
- Avoiding unnecessary allocations.
- Using JIT later if needed.
- Supporting multiple host CPU cores later.

Possible multi-core design:

- One host thread runs the main ternary CPU.
- Worker threads emulate ternary co-processors.
- Scheduler maps ternary processes to host threads.

### Stage 9 - GPU utilization

Real GPU support is hard because GPU drivers are complex and binary.

Practical path:

1. Use UEFI GOP framebuffer first.
2. Add simple 2D drawing.
3. Add a ternary graphics API that writes to the framebuffer.
4. Later investigate using an existing host layer or driver model for hardware acceleration.

First GPU goal:

- Clear screen.
- Draw text.
- Draw rectangles.
- Draw pixels.
- Maybe draw a mouse cursor.

Do not start with full NVIDIA or AMD acceleration. That is too large for the first version.

### Stage 10 - Storage

Start with fake file storage in the VM.

Then add:

- Read-only initramfs-like image.
- Simple ternary file table.
- Basic file commands:
  - `ls`
  - `cat`
  - `write`

Later add real disk access from the bootable host.

## Recommended first Codex task

Create a working balanced ternary library and CLI tool.

Acceptance criteria:

- `3bit convert 10` prints balanced ternary.
- `3bit parse 1-10` prints decimal.
- Unit tests pass.
- README explains the syntax.

## Recommended second Codex task

Create the first VM.

Acceptance criteria:

- VM can run a hardcoded program.
- Program can add two ternary numbers.
- Program can print output.
- Tests cover instruction execution.

## Recommended third Codex task

Create the first shell running inside the VM.

Acceptance criteria:

- Shell boots.
- `help` works.
- `regs` shows registers.
- `halt` stops the VM.

## Non-goals for now

Do not start with:

- Full hardware GPU acceleration.
- Full POSIX compatibility.
- Internet support.
- Modern app support.
- Real hardware disk installer that overwrites drives.
- Custom ternary CPU hardware.

Those are later goals.

## Project philosophy

This should be real enough to boot on a laptop eventually, but simple enough to build step by step. The ternary VM and ternary kernel are the heart of the project.
