// @flow

import _ from 'lodash'
import gulp from 'gulp'

import {config, browserSync} from './config'

gulp.task('serve', ['browserSync', 'watch']);

gulp.task('watch', ['build'], !config.serve ? _.noop : function() {
  gulp.watch(config.build.index, ['justIndex']);

  if (config.scripts) {
    gulp.watch(config.scripts.src, ['scripts']);

    if (config.scripts.ng2html) {
      gulp.watch(config.scripts.ng2html.src, ['scripts']);
    }
  }

  if (config.statics) {
    gulp.watch(config.statics.src, ['statics']);
  }

  if (config.images) {
    gulp.watch(config.images.src, ['images']);
  }

  if (config.styles) {
    gulp.watch(config.styles.files, ['styles']);
  }

  var bowerTasks = _.intersection(_.keys(gulp.tasks), ['bowerScripts', 'bowerStyles', 'bowerFonts']);
  gulp.watch(config.build.bowerjson, bowerTasks);

  // watch any change in dist folder; reload immediately in case of detected change
  var watchGlob = [config.build.dest + '**'];

  // don't watch CSS assets, these will be handled in sass by CSS injections by browserSync.stream
  if (config.styles) {
    watchGlob.push('!' + config.styles.dest + '*');
  }
  if (config.fonts) {
    watchGlob.push('!' + config.fonts.dest + '*');
  }
  gulp.watch(watchGlob, browserSync.reload);
});
