(function() {
  "use strict";

  // get dependencies
  const assemble = require("fabricator-assemble");
  const browserSync = require("browser-sync");
  const del = require("del");
  const gulp = require("gulp");
  const gulpif = require("gulp-if");
  const gutil = require("gulp-util");
  const imagemin = require("gulp-imagemin");
  const prefix = require("gulp-autoprefixer");
  const runSequence = require("run-sequence");
  const sass = require("gulp-sass");
  const svgstore = require("gulp-svgstore");
  const svgmin = require("gulp-svgmin");
  const webpack = require("webpack");
  const webpackDevOptions = require("./webpack.dev");
  const webpackProdOptions = require('./webpack.prod');

  const config = {
    dev: gutil.env.dev,
    images: {
      src: ["src/images/**/*", "src/favicon.ico", "!src/images/sprites/**/*"],
      dest: "dist/assets/images",
      watch: "src/assets/images/**/*"
    },
    sprites: {
      src: ["src/assets/images/sprites/**/*.svg"],
      dest: "dist/assets/images",
      watch: "src/assets/images/sprites/**/*.svg"
    },
    dest: "dist"
  };

  var options = {
    layout: "default",
    layouts: "src/views/layouts/*",

    views: ["src/views/**/*", "!src/views/+(layouts)/**"],
    materials: "src/materials/**/*",
    data: "src/data/**/*.{json,yml}",
    docs: "src/docs/**/*.md",
    keys: {
      materials: "materials",
      views: "views",
      docs: "docs"
    },

    logErrors: false,
    onError: function(error) {},
    dest: "dist"
  };
  //helpers: {},
  // for watching
  var paths = {
    js: ["./src/scripts/**/**.js", "./src/scripts/**/**.vue"],
    css: ["./src/scss/**/*.scss"]
  };

  gulp.task("assemble", function() {
    return assemble(options);
  });

  gulp.task("clean", del.bind(null, ["dist/"]));

  gulp.task("images", () => {
    return gulp
      .src(config.images.src)
      .pipe(imagemin())
      .pipe(gulp.dest(config.images.dest));
  });

  gulp.task("sass", function() {
    //console.log('run sass');
    return gulp
      .src("./src/scss/**/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(prefix("last 2 versions"))
      .pipe(gulp.dest("./dist/assets/styles"));
  });

  gulp.task("scripts", function(callback) {
    let webpackOptions = webpackProdOptions;
    if(config.dev) {
      webpackOptions = webpackDevOptions;
    }
    webpack(webpackOptions, function(error, stats) {
      // if error do something here such as gutil error
      callback();
    });
  });

  gulp.task("serve", function(callback) {
    // webpack will serve on port 8090 and hot compile any changes
    browserSync({
      server: {
        baseDir: "./dist"
      },
      notify: true
    });
    gulp.start("watch");
  });

  gulp.task("watch", function(callback) {
    console.log("watching?", paths.css);
    // watch for any changes to the js/jsx and build if detected
    gulp
      .watch("src/scss/**/*.{scss, css}", ["sass"])
      .on("change", browserSync.reload);
    gulp
      .watch("src/**/*.{html,md,json,yml}", ["assemble"])
      .on("change", browserSync.reload);
    gulp.watch(paths.js, ["scripts"]).on("change", browserSync.reload);
  });

  gulp.task("default", ["clean"], () => {
    // define build tasks
    const tasks = [
      "sass",
      "scripts",
      "images",
      //'sprites',
      //'copy',
      //'fonts',
      "assemble"
    ];

    // run build
    runSequence(tasks, () => {
      if (config.dev) {
        gulp.start("serve");
      }
    });
  });
})();
