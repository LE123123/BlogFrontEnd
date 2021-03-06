import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import path from 'path';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { rootSaga } from './modules';
import createSagaMiddleware from '@redux-saga/core';
import PreloadContext from './lib/PreloadContext';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { END } from 'redux-saga';
import { HelmetProvider } from 'react-helmet-async';

const statsFile = path.resolve('./build/loadable-stats.json');

function createPage(root, tags) {
	return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,shrink-to-fit=no"
      />
      <meta name="theme-color" content="#000000" />
      <title>React App</title>
      ${tags.styles}
      ${tags.links}
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">
        ${root}
      </div>
      ${tags.scripts}
    </body>
    </html>
      `;
}

const app = express();

const serverRender = async (req, res, next) => {
	const context = {};
	const sagaMiddleware = createSagaMiddleware();
	const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

	const sagaPromise = sagaMiddleware.run(rootSaga).toPromise();

	const preloadContext = {
		done: false,
		promises: [],
	};

	const extractor = new ChunkExtractor({ statsFile });
	const jsx = (
		<ChunkExtractorManager extractor={extractor}>
			<PreloadContext.Provider value={preloadContext}>
				<Provider store={store}>
					<StaticRouter location={req.url} context={context}>
						<HelmetProvider>
							<App />
						</HelmetProvider>
					</StaticRouter>
				</Provider>
			</PreloadContext.Provider>
		</ChunkExtractorManager>
	);

	ReactDOMServer.renderToStaticMarkup(jsx); // renderToStaticMarkup?????? ?????? ??????????????????.
	store.dispatch(END);

	try {
		await sagaPromise;
		console.log('preloadContext', preloadContext);
		await Promise.all(preloadContext.promises); // ?????? ??????????????? ???????????????.
		console.log('preload store state >> ', store.getState());
	} catch (e) {
		return res.staus(500);
	}

	preloadContext.done = true;
	const root = ReactDOMServer.renderToString(jsx); // ???????????? ??????

	const stateString = JSON.stringify(store.getState()).replace(/</g, '\\u003c');
	const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`; // ????????? ?????? ????????? ??????????????? ???????????????.

	const tags = {
		scripts: stateScript + extractor.getScriptTags(),
		links: extractor.getLinkTags(),
		styles: extractor.getStyleTags(),
	};
	res.send(createPage(root, tags)); // ????????????????????? ???????????? ???????????????.
};

const serve = express.static(path.resolve('./build'), {
	index: false, // "/" ???????????? index.html ??? ???????????? ????????? ??????
});

app.use(serve);
app.use(serverRender);

const port = process.env.PORT | 3333;

app.listen(port, () => {
	console.log('HTTP Server is Running on Port >> ' + port);
});
