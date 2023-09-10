import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import del from 'del';
import sass from 'gulp-dart-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import autoprefixer from 'autoprefixer';
import htmlmin from 'gulp-htmlmin';
import squoosh from 'gulp-libsquoosh';
import webp from 'gulp-webp';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import terser from 'gulp-terser';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(browser.stream());
}

// HTML

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Минификация JS

export const scripts = () => {
  return gulp.src('source/js/**/*.js')
    .pipe(terser())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

// Оптимизация растровых изображений

export const imageOptim = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

// Оптимизация SVG

export const svgOptim = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/icons.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));
}

// Создание SVG-спрайта

export const sprite = () => {
  return gulp.src('source/img/sprite/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

// Конвертация в WebP

export const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(webp())
    .pipe(gulp.dest('build/img'))
}

// Копирование изображений

export const imageCopy = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
    .pipe(gulp.dest('build/img'))
}

// Копирование

export const copy = (done) => {
  return gulp.src([
    'source/fonts/*.{woff,woff2,otf,ttf}',
    'source/*.ico',
    'source/img/**/*.svg',
    'source/manifest.webmanifest',
    '!source/img/sprite/*.svg'
  ]);
  done();
}

// Очистка

export const clean = () => {
  return del('build');
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

// Сборки

export const build = gulp.series(
  clean,
  copy,
  imageOptim,
  svgOptim,
  gulp.parallel(
    html,
    styles,
    scripts,
    createWebp,
    sprite
  )
);

export default gulp.series(
  clean,
  copy,
  imageCopy,
  gulp.parallel(
    html,
    styles,
    scripts,
    createWebp,
    sprite
  ),
  gulp.series(
    server,
    watcher
  )
);
