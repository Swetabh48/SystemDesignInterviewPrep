import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@excalidraw/excalidraw", "roughjs"],
  },
  resolve: {
    alias: {
      // Fix roughjs ESM resolution used by Excalidraw
      "roughjs/bin/rough": "roughjs/bin/rough.js",
    },
  },
  define: {
    "process.env.IS_PREACT": JSON.stringify("false"),
  },
});
