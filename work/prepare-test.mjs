import {build} from 'esbuild';
await build({stdin:{contents:'export * from "./src/sim.ts"; export * from "./src/navigation.ts"; import {initializeNavigationGeography} from "./src/navigation.ts"; import land from "./public/data/land.geojson"; initializeNavigationGeography(land);',resolveDir:process.cwd()},loader:{'.geojson':'json'},bundle:true,platform:'node',format:'esm',outfile:'work/sim-bundle.mjs'});

await build({entryPoints:['src/clock.ts'],bundle:true,platform:'node',format:'esm',outfile:'work/clock-bundle.mjs'});
