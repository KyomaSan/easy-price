import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
// element-plus
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import legacy from "@vitejs/plugin-legacy";

// https://vite.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        vue(),
        vueDevTools(),
        // element-plus
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        // 打包后跨域插件
        legacy({
            targets: ["ie>=11"],
            additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
        }),
    ],

    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    //
    server: {
        //api1  易手游
        proxy: {
            "/yishouyou": {
                target: "https://www.swcbg.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/yishouyou/, ""),
            },
            /* 8618277：全命全精 */
            /* 8618226小卡拉米 */
            "/kjs": {
                target: "https://kejinlianmeng.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/kjs/, ""),
            },
            "/qibabayi": {
                target: "https://gw.7881.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/qibabayi/, ""),
            },
        },
    },
});
