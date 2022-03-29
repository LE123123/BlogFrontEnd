const paths = require('./paths');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = {
	mode: 'production',
	entry: paths.ssrIndexJs, // 엔트리 경로
	target: 'node', // node환경에서 실행될 것임 ( 서버가 express서버니까 )
	//
	output: {
		path: paths.ssrBuild, // 빌드 경로
		filename: 'server.js', // 파일 이름
		chunkFilename: 'js/[name].chunk.js', // 청크 파일 이름
		publicPath: paths.publicUrlOrPath, // 정적 파일이 제공될 경로
	},
	module: {
		rules: [
			{
				oneOf: [
					// 자바스크립트를 위한 처리
					// 기존 webpack.config.js를 참고하여 작성
					{
						test: /\.(js|mjs|jsx|ts|tsx)$/,
						include: paths.appSrc,
						loader: require.resolve('babel-loader'),
						options: {
							customize: require.resolve(
								'babel-preset-react-app/webpack-overrides',
							),
							presets: [
								[
									require.resolve('babel-preset-react-app'),
									{
										runtime: 'automatic',
									},
								],
							],
							cacheDirectory: true,
							cacheCompression: false,
							compact: false,
						},
					},
					// CSS를 위한 처리
					{
						// css-loader를 통해 import된 css파일을 자바스크립트로 변환
						test: cssRegex,
						// CSS Module은 제외한다.
						exclude: cssModuleRegex,
						loader: require.resolve('css-loader'),
						options: {
							// @import CSS규칙은 다른 스타일 시트에서 스타일 규칙을 가져올 떄 쓰입니다.
							importLoaders: 1,
							modules: {
								mode: 'icss',
								exportOnlyLocals: true,
							},
						},
					},
					// CSS Module을 위한 처리
					{
						test: cssModuleRegex,
						loader: require.resolve('css-loader'),
						options: {
							importLoaders: 1,
							modules: {
								// exportOnlyLocals -> Useful when you use css module for pre-rendering
								exportOnlyLocals: true,
								mode: 'local',
								// allows to specify a function to generate the classname
								// getCS~~ => buildin function
								getLocalIdent: getCSSModuleLocalIdent,
							},
						},
					},
					// Sass를 위한 처리
					{
						test: sassRegex,
						exclude: sassModuleRegex,
						use: [
							{
								loader: require.resolve('css-loader'),
								options: {
									importLoaders: 3,
									modules: {
										exportOnlyLocals: true,
									},
								},
							},
							require.resolve('sass-loader'),
						],
					},
					// Sass + CSS Module을 위한 처리
					{
						test: sassModuleRegex,
						use: [
							{
								loader: require.resolve('css-loader'),
								options: {
									importLoaders: 3,
									modules: {
										exportOnlyLocals: true,
										getLocalIdent: getCSSModuleLocalIdent,
									},
								},
							},
							require.resolve('sass-loader'),
						],
					},
					// url-loader를 위한 설정
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						loader: require.resolve('url-loader'),
						options: {
							emitFile: false,
							limit: 10000,
							name: 'static/med ia/[name].[hash:8].[ext]',
						},
					},
					// 위에서 설정된 확장자를 제외한 파일들은
					// file-loader를 사용합니다.
					{
						loader: require.resolve('file-loader'),
						exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
						options: {
							emitFile: false,
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
				],
			},
		],
	},
	resolve: {
		// react, react-dom/server같은 라이브러리르 import구문으로 불러오면 node_modules에서
		// 찾아 사용합니다. 라이브러리를 불러오면 빌드할 떄 결과물 파일 안에 해당 라이브러리 관련 코드가 같이 번들링됨
		modules: ['node_modules'],
	},
	externals: [nodeExternals({ allowlist: [/@babel/] })],
	plugins: [new webpack.EnvironmentPlugin({})],
};
