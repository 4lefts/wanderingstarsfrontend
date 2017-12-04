const path = require('path')

module.exports = {
	entry: './src/index.js',
	output: {
		filename: './app.js',
		publicPath: '/'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets:['env']
				}
			}]
		}]
	},
}