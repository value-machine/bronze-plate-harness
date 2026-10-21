import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "fs";
import path from "path";
import { devTasksPlugin } from "./vite-plugin-dev-tasks";

const packageVersion = (
  JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf8")) as { version: string }
).version;

// https://vite.dev/config/
export default defineConfig({
  // Error logs need a release to decide when a fixed error has come back (see errorLoggingService).
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(
      process.env.VITE_APP_VERSION || packageVersion
    ),
  },
  plugins: [react(), tailwindcss(), devTasksPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
