module.exports = {
  presets: [
    [
      '@babel/preset-env'
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import'
  ]
};