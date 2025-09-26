import esbuild from "esbuild";

esbuild.build({
    entryPoints: [
        "src/html.ts",
        "src/me.ts"
    ],
    outdir: "dist",
    format: "iife",
    bundle: true,
    sourcemap: true,
    external: [],
    splitting: false,
    minify: true,
    keepNames: true
}).catch(() => process.exit(1));