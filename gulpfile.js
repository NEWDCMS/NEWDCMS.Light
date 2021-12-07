// 用于压缩js,wxml
'use strict'
const {
    task,
    dest,
    src,
    series
} = require('gulp')

 // 压缩 .js 
 const uglify = require('gulp-uglify-es').default

// task('js', function () {
//     return src('miniprogram_npm/**/*.js')
//     .pipe(uglify())
//     .pipe(dest('miniprogram_npm/'))
// })

// var cleanCSS = require('gulp-clean-css');
// task('css', function () {
//     return src('packagePages/**/*.wxss')
//     .pipe(cleanCSS())
//     .pipe(dest('packagePages/**/'))
// })

// task('wxs', function () {
//     return src(['dist/**/*.wxs', '!dist/components/vant/wxs/add-unit.wxs'])
//         .pipe(uglify({
//             compress: {
//                 ie8: true,       // 支持 ie8，为了禁止 a === undefined 自动转换为 void 0 === a
//                 join_vars: false // 禁止合并 var
//             }
//         }))
//         .pipe(dest('dist/'))
// })


// // 压缩 .wxml
// const htmlmin = require('gulp-htmlmin')
// task('wxml', function () {
//     return src('dist/**/*.wxml').pipe(htmlmin({
//         caseSensitive: true,     // 大小写敏感
//         removeComments: true,    // 删除 HTML 注释
//         keepClosingSlash: true,  // 单标签上保留斜线
//         collapseWhitespace: true,// 压缩 HTML
//         ignoreCustomFragments: [
//             /<input([\s\S]*?)<\/input>/
//         ],
//     })).pipe(dest('dist/'))
// })

// 在命令行使用 gulp auto 启动此任务
// gulp.task('auto', function () {
//     // 监听文件修改，当文件被修改则执行 script 任务
//     gulp.watch('js/1.js', ['jscompress']);
//     gulp.watch('css/my.css', ['csscompress']);
// });

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 script 任务和 auto 任务
//gulp.task('default', ['auto']);

// task(
//     'default',
//     series([
//         'css',
//         //'js',
//         //'wxml',
//         //...
//     ])
// )