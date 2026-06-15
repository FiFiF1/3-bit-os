# Boot Modes Draft

Status: draft

This file defines how 3 Bit OS should run on real laptops.

## Core rule

The balanced ternary kernel does not boot directly on laptop hardware.

A binary host boots first, then starts the ternary VM, then the VM starts the ternary kernel.

## Mode 1 - Desktop runner

Runs as a normal program on an existing OS.

Purpose:

- fastest testing
- easiest debugging
- CI support
- first shell implementation

Host services:

- terminal output
- stdin keyboard input
- file-backed storage
- host clock

## Mode 2 - UEFI firmware-hosted app

Runs as an x86_64 UEFI application.

Expected path on removable media:

`EFI/BOOT/BOOTX64.EFI`

Purpose:

- first real laptop boot
- no custom keyboard driver yet
- no custom disk driver yet
- uses firmware services while available

Host services:

- UEFI console input
- UEFI text output or GOP framebuffer
- optional file loading from EFI System Partition

Limit:

- This is not full hardware ownership yet.

## Mode 3 - Post-ExitBootServices micro-host

Runs after the UEFI host calls `ExitBootServices()`.

Purpose:

- real OS-like ownership of the machine
- memory map ownership
- framebuffer carry-forward
- later custom drivers

Requirements before entering this mode:

- memory map captured
- framebuffer mode captured
- kernel image loaded
- VM initialized
- fallback panic output planned

Limit:

- UEFI boot services are gone.
- UEFI keyboard input is gone.
- UEFI file loading is gone.
- Device drivers become the host's responsibility.

## Installer path

Safe order:

1. QEMU disk image.
2. Raw USB image.
3. Manual copy to EFI System Partition.
4. Non-destructive installer.
5. Only much later, partitioning and internal disk install.

Never make Codex write destructive disk installer code without a separate explicit task and safety review.

## First boot acceptance criteria

A successful first laptop boot means:

- laptop boots `BOOTX64.EFI`
- screen shows `3 Bit OS`
- ternary VM starts
- ternary kernel prints boot message
- shell accepts at least `help` and `halt`

## QEMU acceptance criteria

A successful QEMU boot means:

- image boots through OVMF or UEFI firmware
- same `BOOTX64.EFI` is used
- shell prompt appears
- CI can detect the prompt
