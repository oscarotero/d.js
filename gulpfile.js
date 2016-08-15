const gulp = require('gulp');
const uglify = require('gulp-uglify');

gulp.task('compress', function () {
    gulp.src('d.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['compress']);