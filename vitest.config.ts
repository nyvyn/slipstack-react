import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(viteConfig, defineConfig({
    test: {
        coverage: {reporter: ["text", "lcov"]},
        environment: "jsdom",
        globals: true,
        setupFiles: "./vitest.setup.ts",
    }
}));
