/* ���� ����� �ѷ��� gulp��� ������ �Ҵ��մϴ�. */
var gulp = require('gulp');

/* ����-�� ����� �ѷ��� shell�̶�� ������ �Ҵ��մϴ�. */
var shell = require('gulp-shell')

/* ������-��ũ ����� �ѷ��� �ν��Ͻ��� �����ϰ� browserSync�̶�� ������ �Ҵ��մϴ�. */
var browserSync = require('browser-sync').create();

/* build��� �̸��� ���� �½�ũ�� ����ϰ� �½�ũ ȣ��� ����� shell �½�ũ�� �����մϴ�. */
gulp.task('build', shell.task(['bundle exec jekyll build --watch']));

/* serve��� �̸��� ���� �½�ũ�� ����ϰ� ȣ��� ����� �Լ��� �����մϴ�.
�� �Լ������� ������-��ũ�� �ʱ�ȭ�ϰ� ������ ���͸��� ������ ��
���� ��ġ�� ȣ���� _site ���͸� ���� ��� ������ ������ ������ ������ 
����(change)�� �߰ߵ� ��� ��������ũ�� ���ε� �޼ҵ带 �����ŵ�ϴ�. */
gulp.task('serve', function() {
   browserSync.init({server: {baseDir: '_site/'}});
   gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});

/* ���� ����� build�� serve��� �½�ũ�� �����մϴ�. */
gulp.task('default', gulp.parallel('build', 'serve'));
