const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['./src/main.js'],
  minify: true,
  bundle: true,
  outdir: "./dist",
  target: "es2016"
})