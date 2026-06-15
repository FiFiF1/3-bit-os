# Host ABI v0 Draft

Status: draft

The host ABI defines how the ternary kernel asks the binary host for real hardware services.

The ternary kernel must not call UEFI, OS APIs, or laptop hardware directly.

Instead, the kernel uses `TRAP id` instructions. The VM catches the trap and forwards it to the binary host service table.

## Goals

- Same ternary kernel can run in desktop runner and UEFI host.
- Host services are versioned.
- Hardware-specific code stays outside the ternary kernel.
- Dangerous services are disabled until explicitly implemented.

## Service call convention

Draft convention:

- `A` = service id
- `B` = first argument
- memory buffer = extra arguments when needed
- return value in `A`
- status in `FLAGS`

This may change after the ISA implementation starts.

## Required services

| Service | Purpose |
|---|---|
| `0` | host ABI version |
| `1` | console write |
| `2` | console read key or line |
| `3` | framebuffer info |
| `4` | framebuffer blit or draw |
| `5` | monotonic time |
| `6` | block read |
| `7` | block write, disabled by default |
| `8` | entropy/random bytes |
| `9` | shutdown or halt host runner |
| `10` | debug log |

## Console write

Input:

- guest memory address
- length

Output:

- status

Desktop runner implementation:

- write to terminal stdout

UEFI firmware-hosted implementation:

- write using UEFI text output or framebuffer text renderer

Post-ExitBootServices implementation:

- write using framebuffer text renderer

## Console input

Input:

- destination buffer
- max length

Output:

- number of characters read
- status

Desktop runner implementation:

- read stdin

UEFI firmware-hosted implementation:

- use UEFI keyboard input while boot services are available

Post-ExitBootServices implementation:

- later custom keyboard input service

## Framebuffer info

Returns:

- width
- height
- pitch
- pixel format
- framebuffer service flags

The ternary kernel should not receive raw physical addresses directly in v0.

## Framebuffer draw

Version 0 may support simple host-managed draw commands:

- clear screen
- draw pixel
- draw rectangle
- draw text
- blit small buffer

## Storage

Block write is disabled by default until the installer/storage design is safe.

The first storage backend should be file-backed in the desktop runner.

## Error handling

Every service returns a status.

Minimum status values:

- success
- unsupported
- invalid argument
- out of range
- device error
- permission denied
- fatal

## Security rule

No service may write to host disk or firmware settings unless the user explicitly requested an installer or destructive operation.
