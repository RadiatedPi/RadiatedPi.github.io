// @ts-check
import { defineConfig, fontProviders } from 'astro/config';


// https://astro.build/config
export default defineConfig({
  site: 'https://relli.gay',
  fonts: [{
    provider: fontProviders.local(),
    name: "AnnonceW01-Regular",
    cssVariable: "--font-annonce",
    options: {
      variants: [{
        src: ['./src/assets/fonts/AnnonceW01Regular.ttf'],
        weight: 'normal',
        style: 'normal'
      }]
    }
  }]
});

