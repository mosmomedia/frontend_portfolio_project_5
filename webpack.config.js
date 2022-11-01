import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	// enntry file
	entry: './backend/server.js',
	// 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.js', '.jsx'],
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
						// plugins: ['@babel/plugin-proposal-class-properties'],
					},
				},
			},
		],
	},
	plugins: [new NodePolyfillPlugin()],
	devtool: 'source-map',
	// https://webpack.js.org/concepts/mode/#mode-development
	mode: 'development',
};
