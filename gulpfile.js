//=================================================
// Gulpfile
//=================================================
"use strict";
const ghPages = require("gulp-gh-pages");
var gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  cssbeautify = require("gulp-cssbeautify"),
  removeComments = require("gulp-strip-css-comments"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  cssnano = require("gulp-cssnano"),
  rigger = require("gulp-rigger"),
  uglify = require("gulp-uglify"),
  watch = require("gulp-watch"),
  plumber = require("gulp-plumber"),
  imagemin = require("gulp-imagemin"),
  run = require("run-sequence"),
  rimraf = require("rimraf"),
  webserver = require("browser-sync");

//=================================================
// Paths to source/dist/watch files
//=================================================
var path = {
  build: {
    html: "dist/",
    js: "dist/assets/js/",
    css: "dist/assets/css/",
    img: "dist/assets/img/",
    fonts: "dist/assets/fonts/",
    icons: "dist/assets/icons/",
    json: "dist/assets/",
  },
  src: {
    html: "src/*.{htm,html,php}",
    js: "src/assets/js/*.js",
    css: "src/assets/sass/style.scss",
    img: "src/assets/img/**/*.*",
    fonts: "src/assets/fonts/**/*.*",
    icons: "src/assets/icons/**/*.*",
    json: "src/assets/*.json",
  },
  watch: {
    html: "src/**/*.{htm,html,php}",
    js: "src/assets/js/**/*.js",
    css: "src/assets/sass/**/*.scss",
    img: "src/assets/img/**/*.*",
    fonts: "src/assets/fonts/**/*.*",
    icons: "src/assets/icons/**/*.*",
    json: "src/assets/*.json",
  },
  clean: "./dist",
};

//=================================================
// Webserver config
//=================================================
var config = {
  server: "dist/",
  notify: false,
  open: true,
  ui: false,
};

//=================================================
// Tasks
//=================================================
gulp.task("webserver", function () {
  webserver(config);
});

gulp.task("html:build", function () {
  return gulp
    .src(path.src.html)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(webserver.reload({ stream: true }));
});

gulp.task("css:build", function () {
  gulp
    .src(path.src.css)
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: true,
      })
    )
    .pipe(cssbeautify())
    .pipe(gulp.dest(path.build.css))
    .pipe(
      cssnano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(path.build.css))
    .pipe(webserver.reload({ stream: true }));
});

gulp.task("js:build", function () {
  gulp
    .src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest(path.build.js))
    .pipe(webserver.reload({ stream: true }));
});

gulp.task("fonts:build", function () {
  gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
});

gulp.task("icons:build", function () {
  gulp.src(path.src.icons).pipe(gulp.dest(path.build.icons));
});

gulp.task("image:build", function () {
  gulp
    .src(path.src.img)
    .pipe(
      imagemin({
        optimizationLevel: 3,
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
      })
    )
    .pipe(gulp.dest(path.build.img));
});

gulp.task("json:build", function () {
  gulp.src(path.src.json).pipe(gulp.dest(path.build.json));
});

gulp.task("clean", function (cb) {
  rimraf(path.clean, cb);
});

gulp.task("build", function (cb) {
  run(
    "clean",
    "html:build",
    "css:build",
    "js:build",
    "fonts:build",
    "icons:build",
    "image:build",
    "json:build",
    cb
  );
});

gulp.task("watch", function () {
  watch([path.watch.html], function (event, cb) {
    gulp.start("html:build");
  });
  watch([path.watch.css], function (event, cb) {
    gulp.start("css:build");
  });
  watch([path.watch.js], function (event, cb) {
    gulp.start("js:build");
  });
  watch([path.watch.img], function (event, cb) {
    gulp.start("image:build");
  });
  watch([path.watch.fonts], function (event, cb) {
    gulp.start("fonts:build");
  });
  watch([path.watch.icons], function (event, cb) {
    gulp.start("icons:build");
  });
  watch([path.watch.json], function (event, cb) {
    gulp.start("json:build");
  });
});

gulp.task("default", function (cb) {
  run("clean", "build", "webserver", "watch", cb);
});

// deploy

gulp.task("deploy", function () {
  return gulp.src("./dist/**/*").pipe(ghPages());
});
