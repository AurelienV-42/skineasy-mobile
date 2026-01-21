module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@features': './src/features',
            '@shared': './src/shared',
            '@navigation': './src/navigation',
            '@theme': './src/theme',
            '@i18n': './src/i18n',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
