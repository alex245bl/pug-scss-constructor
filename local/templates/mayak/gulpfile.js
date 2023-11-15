var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify'),
    sourcemaps = require('gulp-sourcemaps'),
    pug = require('gulp-pug'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    svgmin= require("gulp-svgmin"),
    rename = require('gulp-rename'),
    svgstore = require('gulp-svgstore');

var imageMinParams = [
    imagemin.svgo({
        plugins: [
            {collapseGroups: false},
        ]
    }),
    imagemin.gifsicle(),
    imagemin.mozjpeg(),
    imagemin.optipng(),
];
var path = {
    build: {
        js: 'js/',
        css: '.',
        distCss: 'css/',
        distJs: 'js/',
        images: 'images/',
        uploads: '../../../upload/temp/',
        fonts: 'fonts/',
        svgSprite: 'images/',
        html: 'html/',
    },
    src: {
        js: 'src/js/*.js',
        distJs: 'src/dist/js/*',
        distCss: 'src/dist/css/*',
        stylesTemplate: 'src/css/template_styles/*.scss',
        styles: 'src/css/styles/*.scss',
        scssMixins: 'src/css/mixins/*.scss',
        variables: 'src/css/variables.scss',
        images: 'src/images/**/*.*',
        uploads: 'src/uploads/**/*.*',
        svgSprite: 'src/svg-sprite/*.svg',
        fonts: 'src/fonts/**/*.*',
        html: 'src/html/*.pug',
    },
    watch: {
        js: 'src/js/*.js',
        distJs: 'src/dist/js/*',
        distCss: 'src/dist/css/*',
        stylesTemplate: ['src/css/variables.scss', 'src/css/mixins/*.scss', 'src/css/template_styles/*.scss'],
        styles: ['src/css/variables.scss', 'src/css/mixins/*.scss', 'src/css/styles/*.scss'],
        variables: 'src/css/variables.scss',
        images: 'src/images/**',
        uploads: 'src/uploads/**',
        svgSprite: 'src/svg-sprite/*.svg',
        fonts: 'src/fonts/**/*.*',
        html: ['src/html/*.*','src/components/**']
    }
};

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(minify({ext:{
                min:'.min.js'
            },}))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.js))
});

gulp.task('template_styles:build', function () {
    return gulp.src([path.src.variables, path.src.scssMixins, path.src.stylesTemplate])
        .pipe(plumber())
        .pipe(concat('template_styles.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions'],
            cascade: false
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.css))
});

gulp.task('styles:build', function () {
    return gulp.src([path.src.variables, path.src.scssMixins, path.src.styles])
        .pipe(plumber())
        .pipe(concat('styles.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions'],
            cascade: false
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.css))
});

gulp.task('image:build', function () {
    gulp.src(path.src.images)
        .pipe(imagemin(imageMinParams))
        .pipe(gulp.dest(path.build.images))
    return gulp.src(path.src.uploads)
        .pipe(imagemin(imageMinParams))
        .pipe(gulp.dest(path.build.uploads))
});

gulp.task('svgSprite:build', function () {
    return gulp.src(path.src.svgSprite)
      .pipe(svgmin({
        js2svg: { pretty: true, indent: 2 }
      }))
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(rename('svg-sprite.svg'))
      .pipe(gulp.dest(path.build.svgSprite));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('html:build', function() {
    return gulp.src(path.src.html)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(path.build.html));
});

gulp.task('distCss:build', function() {
    return gulp.src(path.src.distCss)
        .pipe(gulp.dest(path.build.distCss))
});

gulp.task('distJs:build', function() {
    return gulp.src(path.src.distJs)
        .pipe(gulp.dest(path.build.distJs))
});

gulp.task('build', gulp.series(
    'js:build',
    'distJs:build',
    'distCss:build',
    'fonts:build',
    'template_styles:build',
    'styles:build',
    'image:build',
    'svgSprite:build',
    'html:build'
));

gulp.task('js', gulp.series(
    'js:build'
));

gulp.task('css', gulp.series(
    'template_styles:build',
    'styles:build',
));

gulp.task('html', gulp.series(
    'html:build'
));

gulp.task('dist', gulp.series(
    'distCss:build',
    'distJs:build'
));

gulp.task('watch', function(){
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.distJs, gulp.series('distJs:build'));
    gulp.watch(path.watch.distCss, gulp.series('distCss:build'));
    gulp.watch(path.watch.stylesTemplate, gulp.series('template_styles:build'));
    gulp.watch(path.watch.styles, gulp.series('styles:build'));
    gulp.watch(path.watch.images, gulp.series('image:build'));
    gulp.watch(path.watch.svgSprite, gulp.series('svgSprite:build'));
    gulp.watch(path.watch.uploads, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
    gulp.watch(path.watch.html, gulp.series('html:build'));
    console.log('Started !!!');
});
