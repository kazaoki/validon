const gulp         = require('gulp');
const plumber      = require('gulp-plumber');
const rename       = require('gulp-rename');
const sourcemaps   = require('gulp-sourcemaps');
const sass         = require('gulp-sass');
const csslint      = require('gulp-csslint');
const autoPrefixer = require('gulp-autoprefixer');
const cssComb      = require('gulp-csscomb');
const cmq          = require('gulp-merge-media-queries');
const cleanCss     = require('gulp-clean-css');
const eslint       = require('gulp-eslint');
const uglify       = require('gulp-uglify');
const babel        = require('gulp-babel');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync');
const imageMin     = require('gulp-imagemin');
const cache        = require('gulp-cache');
const connectPhp   = require('gulp-connect-php-mb-path');

/**
 * sass compile
 */
// gulp.task('sass', ()=>{
// 	gulp.src(['html/scss/**/*.scss'])
// 		.pipe(plumber({
// 			handleError: function (err) {
// 				console.log(err);
// 				this.emit('end');
// 			}
// 		}))
// 		// .pipe(sourcemaps.init())
// 		.pipe(sass({
// 			// outputStyle: 'nested',
// 			// outputStyle: 'expanded',
// 			// outputStyle: 'compact',
// 			outputStyle: 'compressed',
// 		}))
// 		.pipe(autoPrefixer())
// 		// .pipe(cssComb())
// 		// .pipe(cmq({log:true}))
// 		// .pipe(csslint())
// 		// .pipe(csslint.formatter())
// 		// .pipe(gulp.dest('dist/css'))
// 		// .pipe(rename({suffix: '.min'}))
// 		// .pipe(cleanCss())
// 		// .pipe(sourcemaps.write('.'))
// 		.pipe(gulp.dest('html/css'))
// 		.pipe(browserSync.stream())
// });

/**
 * JS(ES) compile
 */
gulp.task('js', ()=>{
	gulp.src(['src/assets/validon/**/*.js'])
		.pipe(plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(babel({presets: ['env']}))
		.pipe(eslint(
			{
				useEslintrc: false,
				// rules: {
				// 	'strict': 2
				// },
				globals: [
					'jQuery',
					'$'
				],
				envs: [
					'browser'
				]
			})
		)
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.pipe(concat('validon.js'))
		// .pipe(gulp.dest('dist/js'))
		.pipe(uglify())
		// .pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/assets/validon/'))
		.pipe(browserSync.stream())
});

// /**
//  * images compress
//  */
// gulp.task('image', ()=>{
// 	gulp.src(['src/images/**/*'])
// 		.pipe(plumber({
// 			handleError: function (err) {
// 				console.log(err);
// 				this.emit('end');
// 			}
// 		}))
// 		.pipe(cache(imageMin()))
// 		.pipe(gulp.dest('dist/images'))
// });

/**
 * html/php files copy
 */
gulp.task('htmlphp', ()=>{
	gulp.src(['src/**/*.html', 'src/**/*.php', 'src/**/*.css'])
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
});

/**
 * other files copy
 */
gulp.task('other', ()=>{
	gulp.src(['src/assets/validon/VERSION'])
		.pipe(gulp.dest('dist/assets/validon'))
});

// /**
//  * connect php
//  */
// gulp.task('connect-php', ()=>{
// 	connectPhp.server({
// 		base: './dist',
// 		stdio: 'ignore'
// 	});
// });

/**
 * watch files change
 */
gulp.task('watch', ()=>{
	gulp.watch('src/**/*.js',['js']);

	// gulp.watch('html/scss/**/*.scss',['sass']);
	// gulp.watch('src/images/**/*',['image']);
	gulp.watch('src/**/*.html',['htmlphp']);
	gulp.watch('src/**/*.php',['htmlphp']);
	gulp.watch('src/**/*.css',['htmlphp']);
	gulp.watch('src/assets/validon/VERSION',['other']);

	// gulp.watch(['html/**/*.html', 'html/**/*.php', 'html/**/*.js'],()=>{
	// 	gulp.src(['html/**/*.html', 'html/**/*.php', 'html/**/*.js'])
	// 		.pipe(browserSync.stream())
	// });

});

/**
 * Sync server proxy: http://localhost:3000 -> localhost:80
 */
gulp.task('server', ()=>{
	browserSync.init({
		// server: {baseDir: 'dist'}, // static
		// proxy: 'localhost:8000', // connect php
		// proxy: 'localhost:80', // genie
		proxy: {
			target: process.platform==='darwin' ? '192.168.99.100' : 'localhost',
			proxyReq: [
				function(proxyReq) {
					proxyReq.setHeader('X-BrowserSync-Proxy-Port', '3000');
				}
			]
		}
	});
});

/**
 * build & watch
 */
// gulp.task('dev', ['js', 'sass', 'image', 'htmlphp', 'assets', 'connect-php', 'server', 'watch']);
gulp.task('dev', ['js', 'htmlphp', 'other', 'server', 'watch']);

/**
 * build only (default))
 */
// gulp.task('default', ['js', 'sass', 'image', 'htmlphp', 'assets']);
gulp.task('default', ['js', 'htmlphp', 'other']);
