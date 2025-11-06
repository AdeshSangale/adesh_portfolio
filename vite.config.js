import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: set your repo name here 👇
export default defineConfig({
  base: "/adesh_portfolio/",
  plugins: [react()],
});