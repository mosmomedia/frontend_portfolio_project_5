const path = require('path');
const nodeExternals = require('webpack-node-externals');

// Node.js - os 모듈 불러오기
const os = require('os');

// CssMinimizerPlugin 모듈 불러오기
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin =
	require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const frontConfig = {
	target: 'web',
	devServer: {
		static: path.join(__dirname, './frontend/public'),
		proxy: {
			'/': 'http://localhost:8000',
			'/about': 'http://localhost:8000/about',
		},
		port: 8080,
		historyApiFallback: true,
	},
	entry: './frontend/src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle-front.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'frontend/public', 'index.html'),
			minify:
				process.env.NODE_ENV === 'production'
					? {
							collapseWhitespace: true, // 빈칸 제거
							removeComments: true, // 주석 제거
					  }
					: false,
		}),
		new MiniCssExtractPlugin(),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false,
			generateStatsFile: true,
			statsFilename: 'bundle-report.json',
		}),
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
	// devtool: 'inline-source-map',
	performance: {
		hints: false,
	},

	mode: 'production',
};

const backConfig = {
	target: 'node',
	externals: [nodeExternals()],
	entry: './backend/server.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
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
