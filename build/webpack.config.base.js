const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: ["./src/main.js"],
	output: {
		path: path.resolve(__dirname, "../built/"),
		filename: 'bundle.[id].js',
		chunkFilename: "[id].js",
		publicPath: "/",
	},
	resolve: {
		alias: {
			"$root": path.resolve(__dirname, '../'),
			"$src": path.resolve(__dirname, '../src'),
		},
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					process.env.NODE_ENV !== 'production' ? 'style-loader' : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						},
					},
				],
			},
			{
				test: /\.ijpg(\?\S*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1024 * 8,
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
				loader: 'file-loader',
				query: {
					name: '[name].[sha512:hash:base64:7].[ext]',
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			// hash: true
			template: "./src/index.html",
			minify: {removeComments: true, collapseWhitespace: true},
		}),
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			NPM_VERSION: JSON.stringify(process.env.npm_package_version),
		}),
	],
	devServer: {
		host: "0.0.0.0",
		historyApiFallback: true,
		disableHostCheck: true,	// Invalid Host header
		port: 12345,
		public: "127.0.0.1:12345",
	},
}
