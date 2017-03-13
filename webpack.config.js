require('babel-polyfill');
const webpack = require('webpack');

module.exports = {
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	],
	entry: {
		index: [
			'eventsource-polyfill',
			'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
			'./src/index.js'
		]
	},
	output: {
		path: __dirname + '/public/js',
		publicPath: '/js/',
		filename: '[name].js'
	},
	resolve: {
		extensions: ['.js', '.styl']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					'babel-loader'
				]
			},
			{
				test: /\.styl$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: function () {
								return [
									require('autoprefixer')({
										browsers: ['last 2 versions']
									})
								]
							}
						}
					},
					'stylus-loader'
				]
			}
		]
	}
};
