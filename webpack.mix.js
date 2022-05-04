let mix = require('laravel-mix');

mix.js('src/js/scripts.js', 'js').
css('src/css/styles.css', 'css').
setPublicPath('dist');