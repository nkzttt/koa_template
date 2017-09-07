import $ from 'jquery';
import log from './util/console';

const sleep = (msec) => new Promise((resolve) => {
	setTimeout(resolve, msec);
});

(async () => {
	await sleep(2000);
	console.log($('body').length);
	log();
})();
