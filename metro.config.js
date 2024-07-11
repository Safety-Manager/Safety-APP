const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: [
      // 기존 설정에서 svg를 제외한 모든 확장자 추가
      'bmp',
      'gif',
      'jpg',
      'jpeg',
      'png',
      'psd',
      'tiff',
      'webp',
      'm4v',
      'mov',
      'mp4',
      'mpeg',
      'mpg',
      'aac',
      'aiff',
      'caf',
      'm4a',
      'mp3',
      'wav',
      'html',
      'pdf',
      'yaml',
      'yml',
      'otf',
      'ttf',
      'zip',
      'txt',
    ].filter(ext => ext !== 'svg'),
    sourceExts: [
      // 기존 설정에서 svg를 추가한 모든 확장자 추가
      'js',
      'json',
      'ts',
      'tsx',
      'jsx',
      'svg',
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
