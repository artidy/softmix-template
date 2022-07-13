const { src, dest, series, parallel, watch } = require('gulp'),
	sass           = require('gulp-sass'),
	fileinclude    = require('gulp-file-include'),
	browserSync    = require('browser-sync'),
	concat         = require('gulp-concat'),
	cssbeautify    = require("gulp-cssbeautify"),
	cleanCSS       = require('gulp-clean-css'),
	cache          = require('gulp-cache'),
	imagemin       = require('gulp-imagemin'),
	jpegrecompress = require('imagemin-jpeg-recompress'),
	pngquant       = require('imagemin-pngquant'),
	autoprefixer   = require('gulp-autoprefixer'),
	ftp            = require('vinyl-ftp'),
	svgspriter     = require('svgspriter'),
	rimraf         = require('gulp-rimraf'),
	path           = {
		app: {
			html:  'app/html/**/*.html',
			htmlO: 'app/html/*.html',
			libs:  'app/assets/libs/',
			js:    'app/assets/js/',
			css:   'app/assets/css/',
			img:   'app/assets/img/',
			fonts: 'app/assets/fonts/',
			sass:  'app/assets/scss/',
		},
		build: {
			cur:   'build/',
			all:   'build/**',
			libs:  'build/assets/libs/',
			js:    'build/assets/js/',
			css:   'build/assets/css/',
			img:   'build/assets/img/',
			fonts: 'build/assets/fonts/',
		}
	};

function svg() {
	svgspriter.run("app/assets/img/svg-icons", "app/assets/img/sprite.svg", "app/assets/img/svg_preview.html");
}

async function styles() {
	return src(path.app.sass + '**/*.scss')
	.pipe(sass())
	.pipe(autoprefixer({
		flexbox: false
	}))
	.pipe(cssbeautify())
	.pipe(dest(path.app.css))
	.pipe(browserSync.stream())
}

function browserSyncInit() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	})
}

function cleanBuild () {
	return src("./build", { read: false }).pipe(rimraf());
}

function htmlBuild () {
	return buildFiles = src('app/*.html')
	.pipe(dest(path.build.cur));
}

function phpBuild () {
	return buildFiles = src('app/*.php')
	.pipe(dest(path.build.cur));
}

function cssBuild () {
	return src(path.app.css + '**/*').pipe(dest(path.build.css));
}

function jsBuild () {
	return src(path.app.js + '**/*').pipe(dest(path.build.js));
}

function fontsBuild () {
	return src(path.app.fonts + '**/*').pipe(dest(path.build.fonts));
}

function libsBuild () {
	return src(path.app.libs + '**/*').pipe(dest(path.build.libs));
}

function imageBuild () {
	return src(path.app.img + '**/*').pipe(cache(imagemin([
		imagemin.gifsicle({ interlaced: true }),
		jpegrecompress({
		  progressive: true,
		  max: 90,
		  min: 80
		}),
		pngquant(),
		imagemin.svgo({ plugins: [{ removeViewBox: false }] })
	  ]))).pipe(dest(path.build.img));
}

async function clearCache () {
	cache.clearAll();
}

function deploy () {
	const conn = ftp.create({
		host:      'host',
		user:      'user',
		password:  'password',
		parallel:  10
	});

	const globs = [path.build.all];

	return src(globs, {buffer: false})
	.pipe(conn.dest('/'));

}

function html() {
	return src(path.app.html)
	.pipe(browserSync.reload({ stream: true }))
}

function htmlInclude() {
	return src(path.app.htmlO)
	.pipe(fileinclude({
		basepath: 'app/html'
	}))
	.pipe(dest('app/'));
}

function watchFiles() {
	watch(path.app.html, parallel(html, htmlInclude));
	watch(path.app.sass + '**/*.scss', parallel(styles));
	watch([path.app.libs + '**/*.js', path.app.js + 'custom.js']);
	watch(path.app.html, cb => cb());
}

exports.default = parallel(html, htmlInclude, styles, svg, browserSyncInit, watchFiles)
exports.deploy = deploy;
exports.clearCache = clearCache;
exports.build = series(
    cleanBuild,
    parallel(
		htmlBuild,
		phpBuild,
		cssBuild,
		jsBuild,
		fontsBuild,
		libsBuild,
		imageBuild
	)
);