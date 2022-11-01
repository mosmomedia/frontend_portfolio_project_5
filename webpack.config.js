const path = require('path');
const nodeExternals = require('webpack-node-externals');

// Node.js - os 모듈 불러오기
const os = require('os');

// CssMinimizerPlugin 모듈 불러오기
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//
const HtmlWebpackPlugin = require('html-webpack-plugin');

const frontConfig = {
	target: 'web',
	entry: './frontend/src/index.js',
	output: {
		path: path.resolve(__dirname, 'docs'),
		filename: 'bundle-front.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'frontend/public', 'index.html'),
		}),
		new MiniCssExtractPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	optimization: {
		// 압축
		minimize: true,
		// 미니마이저
		minimizer: [
			// 플러그인 인스턴스 생성
			new CssMinimizerPlugin({
				// CPU 멀티 프로세서 병렬화 옵션 (기본 값: true)
				parallel: os.cpus().length - 1,
			}),
		],
	},
	devServer: {},
	devtool: 'inline-source-map',
	mode: 'production',
};

const backConfig = {
	target: 'node',
	externals: [nodeExternals()],
	entry: './backend/server.js',
	output: {
		path: path.resolve(__dirname, 'docs'),
		filename: 'bundle-back.js',
	},

	resolve: {
		extensions: ['.js'],
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},

	mode: 'production',
};

module.exports = [frontConfig, backConfig];
