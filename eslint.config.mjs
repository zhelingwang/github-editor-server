import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    files: ['src/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 12,
    },
  },
  // 定义全局变量
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.jest,
      },
    },
  },
  // 推荐的 rules
  pluginJs.configs.recommended,
  // 自定义 rules
  {
    rules: {
      'no-unused-vars': 'off',
    },
  },
  eslintPluginPrettierRecommended,
];
