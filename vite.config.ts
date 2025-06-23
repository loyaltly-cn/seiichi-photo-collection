import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletImportResolver } from '@varlet/import-resolver'
import { resolve } from 'path'
import jsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
      vue(),
      jsx(),
      UnoCSS(),
      components({
          resolvers: [VarletImportResolver()],
          dirs:['src/components'],
          extensions:['vue','jsx','tsx'],
          deep:true,
          dts: 'src/components.d.ts'
      }),
      autoImport({
          resolvers: [VarletImportResolver({ autoImport: true })]
      })
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    base:'./',
    resolve:{
        alias:{
            '@': resolve(__dirname,'src/'),
            '@pages': resolve(__dirname, 'src/pages')
        }
},
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    host: '0.0.0.0',
  },
}));
