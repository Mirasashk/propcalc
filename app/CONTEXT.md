# Context — app

## Purpose

Expo Router app entrypoints and navigation layouts for rendering screen stacks and shared providers.

## Key files

- `_layout.tsx`: Root app layout and provider composition.
- `(tabs)/_layout.tsx`: Tab-level navigation structure.
- `(tabs)/calculators/_layout.tsx`: Nested calculator route grouping.

## Implemented

- [x] Wired global NativeWind stylesheet import at root app layout.
- [x] Kept root navigation stack and provider structure intact.
- [x] Fixed `saved` tab imports to use project path aliases from `src`.
- [x] Corrected Expo Router screen names to match file-based route paths.

## Remaining

- [ ] Add className-based styling usage in screens/components where needed.
- [ ] Validate route-level UI renders correctly after SDK upgrade.

## Conventions

- Keep screens thin; push logic into feature hooks/usecases.
- Place global providers and global stylesheet import in root `_layout.tsx`.
- Avoid direct data-layer imports from app routes.

## Notes

- NativeWind CSS must be imported once at app entry; root layout is used as the single import point.
- Route names in `Stack.Screen` / `Tabs.Screen` must match file-based paths (for example `lookup/index`, `saved/index`).
