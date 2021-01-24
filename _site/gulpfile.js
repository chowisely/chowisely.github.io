/* 걸프 모듈을 둘러와 gulp라는 변수에 할당합니다. */
var gulp = require('gulp');

/* 걸프-셸 모듈을 둘러와 shell이라는 변수에 할당합니다. */
var shell = require('gulp-shell')

/* 브라우저-싱크 모듈을 둘러와 인스턴스를 생성하고 browserSync이라는 변수에 할당합니다. */
var browserSync = require('browser-sync').create();

/* build라는 이름의 걸프 태스크를 등록하고 태스크 호출시 실행될 shell 태스크를 지정합니다. */
gulp.task('build', shell.task(['bundle exec jekyll build --watch']));

/* serve라는 이름의 걸프 태스크를 등록하고 호출시 실행될 함수를 정의합니다.
그 함수에서는 브라우저-싱크를 초기화하고 서버의 디렉터리를 설정한 후
걸프 와치를 호출해 _site 디렉터리 안의 모든 폴더의 파일의 변경을 관찰해 
변경(change)가 발견될 경우 브라우저싱크의 리로드 메소드를 실행시킵니다. */
gulp.task('serve', function() {
   browserSync.init({server: {baseDir: '_site/'}});
   gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});

/* 걸프 실행시 build와 serve라는 태스크를 실행합니다. */
gulp.task('default', gulp.parallel('build', 'serve'));
