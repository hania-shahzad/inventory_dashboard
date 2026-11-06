import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// NOTE: if you deploy to GitHub Pages under /<repo-name>/, add: base: "/<repo-name>/"
export default defineConfig({
  plugins: [react()],
});
