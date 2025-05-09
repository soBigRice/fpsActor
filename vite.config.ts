import { defineConfig } from 'vite';
import { ghPages } from 'vite-plugin-gh-pages';

export default defineConfig({
  base: '/fpsActor/',
  plugins: [
    ghPages({
      branch: 'gh-pages',
      clean: true
    })
  ]
}); 