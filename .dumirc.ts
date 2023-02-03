import { defineConfig } from 'dumi';

const repo = 'LofiInput';
export default defineConfig({
  base: `/${repo}/`,
  publicPath: `/${repo}/`,
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'LofiInput',
  },
  resolve: {
    docDirs: ['dist'],
  },
});
