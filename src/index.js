if (module.hot) {
	module.hot.accept();
}

// load css
require('./style.styl');

const $ = require('jquery');

const sleep = (msec) => new Promise((resolve) => {
	setTimeout(resolve, msec);
});

(async () => {
	await sleep(2000);
	console.log($('body').length);
	require('./console')();
})();
