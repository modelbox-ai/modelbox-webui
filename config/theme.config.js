/**
 * theme.config.js 文件用于配置局点额外的静态资源，包括：资源文件assets、样式styles、脚本scripts
 */
const defaultStyles = [
  'src/styles.less',
];
const defaultAssets = [
  
];
const themeMap = {
  themes: {
    hws: {
      assets: defaultAssets.concat([
        'src/i18n/hws/zh_CN.json',
        'src/i18n/hws/en-US.json',
      ]),
      styles: defaultStyles.concat([
        
      ]),
      scripts: [],
    },
    cmc: { assets: defaultAssets, styles: defaultStyles, scripts: [] },
    ctc: { assets: defaultAssets, styles: defaultStyles, scripts: [] },
    dt: { assets: defaultAssets, styles: defaultStyles, scripts: [] },
    'hec-hk': { assets: defaultAssets, styles: defaultStyles, scripts: [] },
    ocb: { assets: defaultAssets, styles: defaultStyles, scripts: [] },
    private: { assets: defaultAssets, styles: defaultStyles, scripts: [] },
    russia: { assets: defaultAssets, styles: defaultStyles, scripts: [] },
    'private-otc': {
      assets: defaultAssets,
      styles: defaultStyles,
      scripts: [],
    },
  },
};

module.exports = themeMap;
