import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import postCssPxToRem from "postcss-pxtorem";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    // css: {
    //     postcss: {
    //         plugins: [
    //             postCssPxToRem({
    //                 rootValue: 37.5, // 1rem，根据 设计稿宽度/10 进行设置
    //                 propList: ["*"], // 需要转换的属性，这里选择全部都进行转换
    //             }),
    //         ],
    //     },
    // },
});
