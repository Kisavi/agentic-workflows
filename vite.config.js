import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves a project site (not a user/org site) from a
// subpath like https://<user>.github.io/<repo>/ - `base` tells Vite
// to prefix every built asset URL with that subpath, otherwise the
// deployed site loads a blank page (assets would 404 at the wrong path).
export default defineConfig({
  plugins: [react()],
  base: "/agentic-workflows/",
});
