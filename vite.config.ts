import { defineConfig } from 'vite';
import { ghPages } from 'vite-plugin-gh-pages';

export default defineConfig({
  base: '/fpsActor/',
  server: {
    host: "0.0.0.0",
  },
  plugins: [
    ghPages({
      branch: 'gh-pages',
      clean: true
    })
  ]
}); 