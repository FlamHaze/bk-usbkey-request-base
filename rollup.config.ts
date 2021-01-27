import commonjs from "rollup-plugin-commonjs"

const uglify = require('rollup-plugin-uglify')
const pkg = require('./package.json');


export default [
    {
        input: "./dist/lib/index.js",
        output: {
            file: `./dist/bk-usbkey-request-base-amd-${pkg.version}.min.js`,
            format: "amd"
        },
        plugins: [
            commonjs(),
            uglify.uglify()
        ]
    },
    {
        input: "./dist/lib/index.js",
        output: {
            file: `./dist/bk-usbkey-request-base-cjs-${pkg.version}.min.js`,
            format: "cjs"
        },
        plugins: [
            commonjs(),
            uglify.uglify()
        ]
    },
    {
        input: "./dist/lib/index.js",
        output: {
            file: `./dist/bk-usbkey-request-base-iife-${pkg.version}.min.js`,
            name: "bkUsbkeyReqBasse",
            format: "iife"
        },
        plugins: [
            commonjs(),
            uglify.uglify()
        ]
    },
    {
        input: "./dist/lib/index.js",
        output: {
            file: `./dist/bk-usbkey-request-base-umd-${pkg.version}.min.js`,
            name: "bkUsbkeyReqBasse",
            format: "umd"
        },
        plugins: [
            commonjs(),
            uglify.uglify()
        ]
    }
]
// ,
// // {
// //     file: `./dist/index-es-${pkg.version}.min.js`,
// //     format: "es"
// // },
// {
//     file: `./dist/index-umd-${pkg.version}.min.js`,
//         name: "bkUsbkeyRequestBase",
//     format: "umd"
// }