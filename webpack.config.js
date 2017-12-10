const path = require('path')
const extractPlugin = require('extract-text-webpack-plugin')

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'build'),
		publicPath: 'build'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets:['env']
					}
				}]
			},
			{
				test: /\.css$/,
				use: extractPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'postcss-loader']
				})
			}
		]
	},
	plugins: [
		new extractPlugin({filename: 'style.css'})
	]
}