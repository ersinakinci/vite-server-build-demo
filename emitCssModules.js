import { createFilter } from "@rollup/pluginutils";
import path from "path";

export default function emitCssModules() {
  const filterRegex = /\.(t|j)sx?$/;
  const filter = createFilter(
    filterRegex,
    path.resolve(__dirname, "node_modules", "**")
  );
  const cssModuleFilter = createFilter(
    "**/*.module.css",
    path.resolve(__dirname, "node_modules", "**")
  );
  const importMap = new Map();

  return {
    name: "vite-plugin-emit-css-modules",
    moduleParsed(moduleInfo) {
      // Only look at our source files
      if (filter(moduleInfo.id)) {
        // Scan each import for CSS modules
        moduleInfo.importedIds.forEach((importedId) => {
          // If a CSS module is found and we haven't already emitted a chunk, emit a new chunk
          if (cssModuleFilter(importedId)) {
            if (!importMap.get(moduleInfo.id)) {
              const { id } = moduleInfo;
              const name = path.basename(id);

              importMap.set(moduleInfo.id, [importedId]);
              // Emit the chunk. Vite's CSS plugin will emit an asset for this chunk that
              // contains all imported CSS, including our CSS modules.
              // https://github.com/vitejs/vite/blob/b05c405f6884f9612fd8b6c1e7587a553cf58baf/packages/vite/src/node/plugins/css.ts#L897-L929
              this.emitFile({
                type: "chunk",
                id,
                name,
              });
            } else {
              importMap.get(moduleInfo.id)?.push(importedId);
            }
          }
        });
      }
    },
  };
}
