import { WorldRenderer } from '/src/renderer.ts';
const w = new WorldRenderer(document.querySelector('#scene'));
await w.init();
w.setQuality('low');
