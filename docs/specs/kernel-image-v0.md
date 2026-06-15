# Kernel Image v0 Draft

Status: draft

This file defines the first binary container format for a ternary kernel image.

The image file is binary because normal filesystems and firmware are binary. The payload stores balanced ternary data.

## Goals

- Host can validate an image before loading it.
- Desktop runner and UEFI host use the same loader.
- Ternary code and data are packed in a documented way.
- The format is simple enough to implement early.

## File layout

Draft layout:

1. fixed binary header
2. section table
3. packed trit payload sections
4. optional debug symbols

## Header fields

Minimum header fields:

- magic: `3BOSKIMG`
- format version: `0`
- word trit count
- entry point word address
- section count
- flags
- header size
- section table offset
- payload offset
- image CRC or checksum

Exact byte layout should be frozen before loader implementation.

## Sections

Minimum section types:

- code
- read-only data
- writable data
- stack hint
- debug symbols, optional

Each section table entry should include:

- section type
- guest load address
- guest word length
- packed byte offset
- packed byte length
- flags

## Packed trit encoding

External files should use a documented packed-trit format.

Draft recommendation:

- pack 5 trits per byte for file storage
- decode into a host-friendly memory representation at load time
- keep internal VM memory independent from file packing

Trit digit mapping for packing must be frozen before coding.

Suggested mapping:

- `-1` -> `0`
- `0` -> `1`
- `1` -> `2`

This is a ternary digit encoding inside normal binary bytes.

## Loader rules

Loader must:

1. Validate magic.
2. Validate version.
3. Validate header size.
4. Validate section table bounds.
5. Validate payload bounds.
6. Validate CRC/checksum if present.
7. Decode packed trits.
8. Load sections into VM memory.
9. Set `PC` to entry point.

## Safety rules

- malformed image must not panic the host
- malformed image must return a clear loader error
- section overlap is invalid unless explicitly allowed later
- loading outside VM memory is invalid

## First acceptance test

Build a tiny image with one code section:

1. print boot message
2. halt

The desktop runner should load and execute it.
