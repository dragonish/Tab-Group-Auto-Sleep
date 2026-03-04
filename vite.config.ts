import { defineConfig } from 'vite';
import path from 'node:path';
import HTMLLocation from 'rollup-plugin-html-location';
import ZipPack from 'vite-plugin-zip-pack';
import packageInfo from './package.json';

const productionMode = process.env.NODE_ENV === 'production';
const modeDir = productionMode ? 'build' : 'dist';

const htmlNames = [];
const jsNames = ['background'];
const pages = {};
htmlNames.forEach(name => {
  pages[name] = path.resolve(__dirname, `src/${name}/index.html`);
});
jsNames.forEach(name => {
  pages[name] = path.resolve(__dirname, `src/${name}/index.ts`);
});
const outDir = `${path.resolve(__dirname, modeDir)}`;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir,
    sourcemap: !productionMode,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      input: pages,
      output: {
        entryFileNames: '[name]/index.js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'src/assets',
  plugins: [
    HTMLLocation({
      filename: input => input.replace('src/', ''),
    }),
    productionMode
      ? ZipPack({
          inDir: outDir,
          outDir: 'archive',
          outFileName: `${packageInfo.name}_v${packageInfo.version}.zip`,
        })
      : undefined,
  ],
});
