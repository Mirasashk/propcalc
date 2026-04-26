module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
    // Reanimated must be the last Babel plugin (see react-native-reanimated docs).
    plugins: ['react-native-reanimated/plugin'],
  };
};