var gulp         = require('gulp'), 
    sass         = require('gulp-sass'), 
    browserSync  = require('browser-sync'), 
    concat       = require('gulp-concat'), 
    uglify       = require('gulp-uglifyjs'), 
    //cssnano      = require('gulp-cssnano'), 
    rename       = require('gulp-rename'), 
    del          = require('del'), 
    imagemin     = require('gulp-imagemin'), 
    pngquant     = require('imagemin-pngquant'), 
    cache        = require('gulp-cache'), 
    autoprefixer = require('gulp-autoprefixer'),

//========================== СЕРВЕР ===============================
gulp.task('browser-sync_dist', function() { 
    browserSync({ 
        server: { 
            baseDir: 'dist' 
        },
        notify: false 
    });
});

gulp.task('browser-sync_app', function() { 
    browserSync({ 
        server: { 
            baseDir: 'app' 
        },
        notify: false 
    });
});

//========================== ДЕФОЛДНЫЕ ТАСКИ ===============================
//==================== Таски для процесса разработки =======================
gulp.task('sass_app', function(){
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass())
        .pipe(gulp.dist('app/css'));
});

gulp.task('other_app', function(){
    return browserSync.reload({ stream: true });
});

gulp.task('watch_app', function(){
    gulp.watch('app/sass/**/*.sass', gulp.parallel('sass_app')); 
    gulp.watch(['app/*.html',
                'app/css/libs/**/*.css', 
                'app/js/**/*.js', 
                'app/img/**/*.*', 
                'app/fonts/**/*.*'], gulp.parallel('other'));
});

gulp.task('build_app', gulp.parallel('sass_app', 'other_app', 'watch_app'));

//==================== Таски для переноса в продакшн =======================

gulp.task('sass_dist', function() { 
    return gulp.src('app/sass/**/*.sass') 
        .pipe(sass()) 
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        //.pipe(cssnano())
        //.pipe(rename({suffix: '.min'})) 
        //если использовать - нужно переопределить путь подключения в index.html продакшена
        .pipe(gulp.dest('dist/css'))  
        .pipe(browserSync.reload({stream: true})); 
});

gulp.task('scripts_dist', function() {
    return gulp.src('app/js/**/*.js')
        .pipe(concat('main'))
        .pipe(uglify())
        //.pipe(rename({suffix: '.min'})) 
        //если использовать - нужно переопределить путь подключения в index.html продакшена
        .pipe(gulp.dest('dist/js'))
});

gulp.task('html_dist', function() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts_dist', function(){
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('img_dist', function() {
    return gulp.src('app/img/**/*') 
        .pipe(cache(imagemin({ // С кешированием
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('clear', function (callback) {
    return cache.clearAll();
})

gulp.task('del_dist', function(){
    return gulp.pipe( del('dist/**') ).
               .pipe(
                    gulp.src('app/css/normalize.css')
                    .pipe(gulp.dest('dist/css'))
                );

});

gulp.task('watch_dist', function() {
    gulp.watch('app/sass/**/*.sass', gulp.parallel('sass_dist')); 
    gulp.watch('app/*.html', gulp.parallel('html_dist'));
    gulp.watch('app/js/**/*.js', gulp.parallel('scripts_dist'));
    gulp.watch('app/img/**/*.*', gulp.parallel('img_dist'));
    gulp.watch('app/fonts/**/*', gulp.parallel('fonts_dist')); 
});

gulp.task('default', gulp.series('clear', 
                                  'del_dist', 
                                  'sass_dist', 
                                  'html_dist', 
                                  'scripts_dist', 
                                  'img_dist', 
                                  'fonts_dist', 
                                  'browser-sync_dist', 
                                  'watch_dist'
                                ));

/*gulp.task('lib-scripts', function() {
    return gulp.src([ 
        'app/libs/jquery/dist/jquery.min.js', 
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
        ])
        .pipe(concat('libs.min.js')) 
        .pipe(uglify()) 
        .pipe(gulp.dest('app/js')); 
});*/
/*gulp.task('css-libs', function() {
    return gulp.src('app/css/libs.sass') 
        .pipe(sass()) 
        .pipe(cssnano()) 
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest('app/css')); 
});*/