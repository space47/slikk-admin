/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-macros'],
            },
        }),
        dynamicImport(),
    ],
    optimizeDeps: {
        exclude: ['@preflower/barcode-detector-polyfill'],
        force: true,
    },

    assetsInclude: ['**/*.md'],
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        // setupFiles: './src/test/setup.ts',
        include: ['src/**/*.test.tsx'],
        css: true,
    },
    build: {
        outDir: 'build',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
            },
        },
    },
})
