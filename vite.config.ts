import fs from "node:fs";
import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
// import babel from "vite-plugin-babel";
import wasmImageOptimizationPlugin from "wasm-image-optimization/vite-plugin";

export default defineConfig(({ mode }) => ({
  resolve: {
    tsconfigPaths: true,
    alias: [
      {
        find: "../build/server/index.js",
        replacement: "virtual:react-router/server-build",
      },
    ],
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      experimental: { newConfig: true },
    }),
    {
      name: "sync-client-manifest-for-react-router",
      writeBundle() {
        if (this.environment?.name === "client") {
          const src = path.resolve(".cloudflare/output/v0/workers/default/assets");
          const dest = path.resolve("build/client");
          if (fs.existsSync(src)) {
            fs.cpSync(src, dest, { recursive: true });
          }
        }
      },
    },
    tailwindcss(),
    reactRouter(),
    wasmImageOptimizationPlugin(),
    // babel({
    //   filter: /\.[jt]sx?$/,
    //   babelConfig: {
    //     presets: ["@babel/preset-typescript"],
    //     plugins: [["babel-plugin-react-compiler"]],
    //   },
    // }),
    {
      name: "updater",
      async hotUpdate({ server }) {
        const mod = await server.moduleGraph.getModuleByUrl(
          "/app/server/graphql/builder.ts"
        );

        if (mod) {
          server.moduleGraph.invalidateModule(mod);
        }
      },
    },
  ],
  ssr: {
    noExternal: [
      "@pothos/core",
      "@pothos/plugin-drizzle",
      "pothos-drizzle-generator",
      "react-router",
    ],
  },
}));
