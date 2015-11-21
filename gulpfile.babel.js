import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';
import mainBowerFiles from 'main-bower-files';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// 解决gulp不能利用babel正确解决编译es6的问题
// https://markgoodyear.com/2015/06/using-es6-with-gulp/
//利用sass生成styles任务
gulp.task('styles', () => {
  return gulp.src('app/sass/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('app/styles'))
    .pipe(reload({stream: true}));
});

//利用gulp-babel 和 babel-preset-react 动态解析 react文件
gulp.task('presetReact', () => {
  return gulp.src('app/react-src/**/*.js')
    .pipe($.babel({
      //filename: false,
      //filenameRelative: './',
      //plugins: ['syntax-jsx'],
      presets: ['react']
    }))
    .pipe($.sourcemaps.init())
    .pipe(gulp.dest('app/scripts'));
});

//检测js写法
function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint('D:/gitworkspace/eslint-config/react-es6/.eslintrc'))//配置ESLint文件
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint:src', lint('app/react-src/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

//编译替换html中的js和css， build:js 和 build:css 配置，我们用绝对路径
gulp.task('html', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.', 'app/**']});

  return gulp.src(['app/html/**/*.html'], {base: 'app'})
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

//优化图片
gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
        progressive: true,
        interlaced: true,
        // don't remove IDs from SVGs, they are often used
        // as hooks for embedding and styling
        svgoPlugins: [{cleanupIDs: false}]
      }))
      .on('error', function (err) {
        console.log(err);
        this.end();
      })))
    .pipe(gulp.dest('dist/images'));
});

//如果项目中用到了 fonts 用该任务复制字体到dist
gulp.task('fonts', () => {
  return gulp.src(mainBowerFiles({
      filter: '**/*.{eot,svg,ttf,woff,woff2}'
    }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

//复制app下其他文件到dist下
gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

//清理临时和打包目录
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// inject bower components
// 自动添加 bower js 和 css 包
gulp.task('wiredep', () => {
  /*gulp.src('app/sass/!*.scss')
   .pipe(wiredep({
   ignorePath: /^(\.\.\/)+/
   }))
   .pipe(gulp.dest('app/styles'));*/

  gulp.src(['app/*.html', 'app/html/**/*.html', 'app/examples/**/*.html'], {base: 'app'})
    .pipe(wiredep({
      exclude: ['bower_components/normalize.css/normalize.css', 'bower_components/modernizr/modernizr.js'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

//启动服务
gulp.task('serve', ['wiredep', 'styles', 'fonts', /*'lint:src',*/ 'presetReact'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/**/*.html',
    'app/scripts/**/*.js',
    'app/styles/**/*.css',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/sass/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
  gulp.watch('app/react-src/**/*.js', ['lint:src', 'presetReact']);
});

//启动打包后的服务 gulp serve:dist
gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

//启动测试服务 gulp serve:test
gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

//打包
gulp.task('build', ['styles', 'wiredep', 'lint:src', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

//默认任务
gulp.task('default', ['clean'], () => {
  gulp.start('build');
});

//以下任务是测试例子
gulp.task('useref-demo', ['clean'], () => {
  const assets = $.useref.assets({searchPath: ['app/useref-demo']});

  return gulp.src(['app/useref-demo/**/*.html'], {base: 'app'})
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    //.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});
