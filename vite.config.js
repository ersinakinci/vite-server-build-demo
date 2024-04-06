import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import emitCssModules from "./emitCssModules";

export default defineConfig(({ command }) => {
  return {
    build: {
      cssMinify: true,
      minify: true,
      rollupOptions: {
        output: {
          entryFileNames: "_worker.js",
        },
        external: ["node:zlib", "bun:sqlite"],
      },
      // We're not actually using SSR, but using the ssr option compiles
      // the server and enables the ssrEmitAssets option.
      ssr: "./src/index.tsx",
      // Emit global CSS and client JS pulled in by '...?url' imports.
      ssrEmitAssets: true,
      // Generate a manifest.json file that can be used to map compiled CSS modules to components.
      manifest: true,
      target: "es2022",
    },
    plugins: [
      // Experimental plugin to emit CSS modules as chunks.
      command === "build" && emitCssModules(),
      devServer({
        entry: "./src/index.tsx",
      }),
    ],
  };
});
