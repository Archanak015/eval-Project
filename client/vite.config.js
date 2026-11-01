import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    ui: ['@headlessui/react', '@heroicons/react', 'react-toastify'],
                    form: ['formik', 'yup', 'axios']
                }
            }
        },
        chunkSizeWarningLimit: 600
    }
});
