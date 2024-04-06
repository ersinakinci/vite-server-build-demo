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
      ssr: "./src/index.tsx",
      ssrEmitAssets: true,
      manifest: true,
      target: "es2022",
    },
    plugins: [
      command === "build" && emitCssModules(),
      devServer({
        entry: "./src/index.tsx",
      }),
    ],
  };
});
