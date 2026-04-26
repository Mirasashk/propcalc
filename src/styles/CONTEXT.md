# Context — styles

## Purpose

Holds global style inputs used by NativeWind/Tailwind for utility class generation in React Native components.

## Key files

- `global.css`: Tailwind layer directives consumed by NativeWind Metro transform.

## Implemented

- [x] Added Tailwind base/components/utilities directives for NativeWind.

## Remaining

- [ ] Add shared design tokens/utilities if project introduces custom Tailwind theme values.
- [ ] Document any custom class conventions once introduced.

## Conventions

- Keep this folder limited to NativeWind/Tailwind source styles.
- Avoid component-specific styles here; keep those near component files.
- Ensure referenced CSS file path matches Metro NativeWind config input.

## Notes

- `metro.config.js` points to `src/styles/global.css`; changing this filename requires Metro config update.
