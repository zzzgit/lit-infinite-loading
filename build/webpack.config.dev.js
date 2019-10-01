const merge = require("webpack-merge")
const base = require("./webpack.config.base")

const config = {
	devtool: 'source-map',
	plugins: [
	],
}
module.exports = function(env) {
	return merge(base, config)
}
