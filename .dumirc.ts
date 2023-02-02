import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs',
  // docDirs: ['docs-content'],
  resolve: {
    docDirs: ['docs-content'],
  },
  themeConfig: {
    name: 'LofiInput',
  },
});
