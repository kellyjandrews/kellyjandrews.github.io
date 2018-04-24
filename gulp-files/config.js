var src = "./",
	dest = "./assets";

var config = {
	browserSync: {
		server: {
			baseDir: "_site"
		},
		notify: false
	},
	less: {
		src: src + '/less/styles.less',
		watch: src + '/less/**/*.less',
		dest: dest + '/css'
	},
	images: {
		src: dest + '/images/*.*',
		dest: dest + '/images'
	},
	scripts: {
		src: src + 'scripts/scripts.js',
		dest: dest + '/js'
	},
	templates: {
		src: src + "templates/*.hbs"
	},
	fonts: {
		src: [src + 'node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}'],
		dest: dest + "/fonts"
	},
	jekyll: {
		includes: src + '/_includes/**/*.*',
		layouts: src + '/_layouts/**/*.*',
		pages: src + '/_pages/**/*.*',
		posts: src + '/_posts/**/*.*',
		data: src + '/_data/**/*.*',
		drafts: src + '/_drafts/**/*.*'
	}
};

module.exports = config;
