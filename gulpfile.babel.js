import gulp from 'gulp';
import { series , parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify';
import named from 'vinyl-named';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import info from './package.json'

const server = browserSync.create();

const  PRODUCTION = yargs.argv.prod;

const paths = {
  styles:{
    src: ['src/assets/scss/bundle.scss', 'src/assets/scss/admin.scss'],
    dest: 'dist/assets/css'
  },
  images:{
    src: 'src/assets/images/**/*.{jpg,jpeg,png,svg,gif}',
    dest: 'dist/assets/images'
  },
  scripts:{
    src: ['src/assets/js/bundle.js', 'src/assets/js/admin.js'],
    dest: 'dist/assets/js'
  },
  other:{
    src: ['src/assets/**/*', '!src/assets/{images,js,scss}', '!src/assets/{images.js,scss}/**/*'],
    dest: 'dist/assets'
  },
  package: {
    src: [
      '**/*', '!.vscode', '!node_modules{,/**}', '!packaged{,/**', '!src{,/**}', '!.babelrc',
      '!.gitignore', '!gulpfile.babel.js', '!package.json', '!package-lock.js'
    ],
    dest: 'packaged'
  }
}

export const runServer = (done) =>{
    server.init({
      proxy: "http://localhost:8888/wordpress/"
    });
    done()

}

export const reload = (done) => {
  server.reload();
  done()
}

export const clean = () => del(["dist"])

export const styles = () =>{
  return gulp.src(paths.styles.src)
         .pipe(sass().on('error', sass.logError))
         .pipe(gulpif(PRODUCTION, cleanCSS({compatibility: 'ie8'})))
         .pipe(gulp.dest(paths.styles.dest));
}

export const images = ()=>{
  return gulp.src(paths.images.src)
         .pipe(imagemin())
         .pipe(gulp.dest(paths.images.dest));
}

export const watch = ()=>{
  gulp.watch('src/assets/scss/**/*.scss', styles);
  gulp.watch('src/assets/js/**/*.js', scripts)
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.other.src, copy);
  //watch for all file change and reload the browser
  gulp.watch('**', reload)
}

export const copy = ()=>{
  return gulp.src(paths.other.src)
         .pipe(gulp.dest(paths.other.dest))
}

export const scripts = () =>{
  return gulp.src(paths.scripts.src)
         .pipe(named())
         .pipe(webpack({
           module: {
            rules:[
               {
                 test: /\.js$/,
                 exclude: /(node_modules|bower_components)/,
                 use: {
                   loader: 'babel-loader',
                   options:{
                     presets : ['@babel/preset-env']
                   }
                 }
               }
             ]
           },
           output: {
            filename: '[name].js',
          },
          externals: {
            jquery: 'jQuery'
          },
          devtool: !PRODUCTION ? 'inline-source-map' : false
         }))
         .pipe(gulpif(PRODUCTION, uglify()))
         .pipe(gulp.dest(paths.scripts.dest))
}

export const compress = () => {
  return gulp.src(paths.package.src)
          .pipe(replace('__themename', info.name))
          .pipe(zip(`${info.name}.zip`))
          .pipe(gulp.dest(paths.package.dest));
}

export const dev = series(clean, parallel(styles, scripts, images, copy), runServer, watch)
export const build = series(clean, parallel(styles, scripts, images, copy))
export const bundle =  gulp.series(build, compress)

export default dev;