module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@utils': './src/utils',
          '@assets': './assets',
          '@api': './src/api',
          '@navigation': './src/navigation',
          '@constants': './src/constants',
          '@utils': './src/utils',
          '@styles': './src/styles',
        },
      },
    ],
  ],
};
