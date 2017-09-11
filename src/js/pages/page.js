import $ from 'jquery';
import log from '../_util/console';

const sleep = (msec) => new Promise((resolve) => {
	setTimeout(resolve, msec);
});

(async () => {
	await sleep(5000);
	console.log($('body').length);
	log();
})();
