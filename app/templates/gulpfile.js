var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var runSequence = require("run-sequence");
var del = require("del");

var argv = require("minimist")(process.argv.slice(1));
var RELEASE = !!argv.release;
var TASK = argv._[1];
var TEST = TASK === "test";

// Compile: Stylus (.styl) >> CSS
gulp.task("stylus", function() {
  return gulp.src("./styles/main.styl")
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.stylus({
      use: [require("kouto-swiss")()]
    }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest("./build/css"))
    .pipe(plugins.connect.reload());
});

// Compile: HTML
gulp.task("html", function() {
  return gulp.src(["./index.html"])
    .pipe(plugins.htmlReplace({
      "js": "js/main.js",
      "css": "css/main.css",
    }))
    .pipe(gulp.dest("./build"));
});

// Compile: Javscript (bundle through jspm)
gulp.task("jspm", plugins.shell.task([
  "jspm bundle-sfx src/browser.jsx! build/js/main.js --skip-source-maps"
]));

// Build
gulp.task("build", function(cb) {
  if (RELEASE || TEST) {
    runSequence(
      "clean",
      ["stylus", "jspm", "html", "fonts"],
      ["minify:js", "minify:html", "minify:css"],
      "revision",
      "revision:replace",
    cb);
  } else {
    runSequence(
      ["stylus"],
    cb);
  }
});

// Minify: JS
gulp.task("minify:js", function() {
  return gulp.src("./build/js/*.js")
    .pipe(plugins.uglify())
    .pipe(gulp.dest("build/js"));
});

// Minify: CSS
gulp.task("minify:css", function() {
  return gulp.src("./build/css/*.css")
    .pipe(plugins.minifyCss({
      keepBreaks: false,
      rebase: false,
    }))
    .pipe(gulp.dest("./build/css/"));
});

// Minify: HTML
gulp.task("minify:html", function() {
  return gulp.src("./build/*.html")
    .pipe(plugins.minifyHtml({}))
    .pipe(gulp.dest("./build/"));
});

// CSS and JavaScript Asset Revisioning
gulp.task("revision", function() {
  return gulp.src(["build/**/*.css", "build/**/*.js"])
    .pipe(plugins.rev())
    .pipe(gulp.dest("build"))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest("build"))
});

gulp.task("revision:replace", function() {
  var manifest = gulp.src("./build/rev-manifest.json");

  return gulp.src("build/index.html")
    .pipe(plugins.revReplace({manifest: manifest}))
    .pipe(gulp.dest("build"))
    .on("end", function() {
      return del([
        "build/rev-manifest.json",
        "build/css/main.css",
        "build/js/main.js"
      ]);
    });
});

// Fonts
// TODO: Figure out an automatic way of doing this
gulp.task('fonts', function() {
  return gulp.src([
    'bower_components/font-awesome/fonts/*'
  ]).pipe(gulp.dest('build/fonts/'));
});

// Serve
gulp.task("serve", function() {
  return plugins.connect.server({
    root: ((TEST || RELEASE) ? "build" : "."),
    livereload: !(TEST || RELEASE),
    fallback: "index.html"
  });
});

// Watch
gulp.task("watch", function() {
  gulp.watch(["./styles/*.styl"], ["stylus"]);

  gulp.watch(["./index.html"], function() {
    return gulp.src("./index.html").pipe(plugins.connect.reload());
  });

  gulp.watch(["./src/**/*.js*"], function() {
    return gulp.src("./src/**/*.js*").pipe(plugins.connect.reload());
  });
});

// Clean
gulp.task("clean", function(cb) {
  del(["build"], cb);
});

// Test
gulp.task('webdriver_update', plugins.protractor.webdriver_update);

gulp.task("protractor", function(cb) {
  var base = plugins.protractor.getProtractorDir();
  plugins.connect.server({root: "build/", fallback: "index.html"});

  setTimeout(function() {
    gulp.src(["./test/spec/**/*.js"])
      .pipe(plugins.protractor.protractor({
          configFile: "test/protractor.config.js",
          args: [
            '--baseUrl', 'http://127.0.0.1:8080',
          ]
      }))
      .on('error', function(e) { throw e })
      .on('end', function() {
        plugins.connect.serverClose();
        cb();
      });
  }, 250);
});

gulp.task("test", function(cb) {
  runSequence("build", "webdriver_update", "protractor", cb);
});

// Default: Build > Serve > Watch
gulp.task("default", function(cb) {
  runSequence("build", "serve", "watch", cb);
});

// Lint: JS
gulp.task("lint:js", function() {
  return gulp.src("./src/**/*.js*")
    .pipe(plugins.react())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter("jshint-stylish"));
});

// Lint
gulp.task("lint", ["lint:js"]);
