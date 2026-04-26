# Context — propcalc

## Purpose

Root workspace configuration for the Expo React Native app, including dependency versions, bundler/transpiler setup, and project-level tooling scripts.

## Key files

- `package.json`: App dependencies, scripts, and tooling package versions.
- `metro.config.js`: Metro bundler customization with NativeWind integration.
- `babel.config.js`: Babel preset and plugin configuration for Expo Router and NativeWind.
- `tailwind.config.js`: Tailwind/NativeWind scanning and theme configuration.

## Implemented

- [x] Upgraded Expo SDK baseline from 52 to 54 package set.
- [x] Enabled NativeWind runtime dependencies and Metro integration.
- [x] Switched Babel to Expo preset with Expo Router and NativeWind plugins.
- [x] Added missing Expo Router/runtime native dependencies needed for app startup.
- [x] Added `expo-linear-gradient` for chart rendering and removed `react-native-share` for Expo Go compatibility.

## Remaining

- [ ] Run app smoke tests on Android and iOS simulators after Node upgrade.
- [ ] Align remaining third-party packages with React 19/SDK 54 if runtime warnings appear.

## Conventions

- Keep Expo-managed dependency versions aligned with `npx expo install`.
- Keep root config files minimal and deterministic.
- Avoid duplicate dependency declarations across `dependencies` and `devDependencies`.

## Notes

- Expo SDK 54 toolchain expects Node `>=20.19.4`; current environment is slightly below that and may show engine warnings.
- `expo-linking` must match the SDK (e.g. `~8.0.11` for SDK 54). A mistaken major version (e.g. 55.x) will not satisfy `expo-router` and can leave the app stuck on the launch screen in Expo Go.
- `react-native-reanimated` needs `react-native-reanimated/plugin` as the last Babel plugin entry.
