process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.server');
const paths = require('../config/paths');

process.on('unhandledRejection', (err) => {
	throw err;
});

function build() {
	console.log('Creating server build');
	fs.emptyDirSync(paths.ssrBuild);
	let compiler = webpack(config);
	return new Promise((resolve, reject) => {
		compiler.run((err, status) => {
			if (err) {
				console.log(err);
				return;
			}
			console.group(status.toString());
		});
	});
}
build();
