if (module.hot) {
	module.hot.accept();
}
if (process.env.NODE_ENV === 'development') {
	document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
}

// load stylesheets
import Style from './style.styl';

// load scripts
import $ from 'jquery';
import log from './console';

const sleep = (msec) => new Promise((resolve) => {
	setTimeout(resolve, msec);
});

(async () => {
	await sleep(2000);
	console.log($('body').length);
	log();
})();
