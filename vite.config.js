import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/mathplugin.[hash].js",
        chunkFileNames: "assets/mathplugin.[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            return "assets/mathplugin.[hash].css";
          }
          return "assets/mathplugin.[hash].[ext]";
        },
      },
    },
  },
});
