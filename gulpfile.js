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
    args =       = require('yargs').argv;


//========================== СЕРВЕР ===============================
gulp.task('browser-sync', function() { 
    
    browserSync({ 
        server: { 
            baseDir: 'dist' 
        },
        notify: false 
    });
});

//========================== ДЕФОЛДНЫЕ ТАСКИ ===============================

gulp.task('sass', function() { 
    return gulp.src('app/sass/*.sass') 
        .pipe(sass()) 
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        //.pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))  
        .pipe(browserSync.reload({stream: true})); 
});

gulp.task('scripts', function() {
    return gulp.src('app/js/main.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts', function(){
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') 
        .pipe(cache(imagemin({ // С кешированием
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

//========================== ТАКСИ ОЧИСТКИ ===============================
//=================== Очистка кеша и папки продакшена ====================
gulp.task('clear', function (callback) {
    return cache.clearAll();
})

gulp.task('del', function(){
    return del('dist/** ');/*, 
        gulp.src('app/css/normalize.css')
            .pipe(gulp.dest('dist/css'))*/
});

//============================= WATCHING ================================
gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.sass', gulp.parallel('sass')); 
    gulp.watch('app/*.html', gulp.parallel('html'));
    gulp.watch('app/js/**/*.js', gulp.parallel('scripts'));
    gulp.watch('app/img/**/*.*', gulp.parallel('img'));
    gulp.watch('app/fonts/**/*', gulp.parallel('fonts')); 
});

gulp.task('default', gulp.series('clear', 
                                  'del', 
                                  'sass', 
                                  'html', 
                                  'scripts', 
                                  'img', 
                                  'fonts', 
                                  'browser-sync', 
                                  'watch'
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