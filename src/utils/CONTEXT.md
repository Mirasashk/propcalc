# Context — utils

## Purpose

Shared app-level utility helpers for cross-feature concerns such as sharing, formatting wrappers, and platform-safe helper functions.

## Key files

- `share.ts`: Builds human-readable calculation summaries and opens the platform share sheet.

## Implemented

- [x] Switched share behavior to React Native's built-in `Share` API for Expo Go compatibility.
- [x] Kept calculation summary formatting centralized in one utility module.

## Remaining

- [ ] Add unit tests for `buildShareText` output per calculation type.
- [ ] Add platform-specific share fallback behavior only if future requirements need richer sharing options.

## Conventions

- Keep utilities platform-safe and compatible with Expo managed workflow unless native modules are explicitly required.
- Keep functions small and deterministic when possible.
- Throw typed errors from utility boundaries where callers need structured handling.

## Notes

- `react-native-share` requires a custom native build; Expo Go users should use the built-in `Share` API.
