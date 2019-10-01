const merge = require("webpack-merge")
const base = require("./webpack.config.base")
// const MinifyPlugin = require("babel-minify-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')

const config = {
	output: {
		filename: 'bundle.[chunkhash].js',
		chunkFilename: "[id].[chunkhash].js",
	},
	devtool: false,
	optimization: {
		minimizer: [new TerserPlugin({
			sourceMap: false,
		})],
	},
}
module.exports = function(env) {
	return merge(base, config)
}
