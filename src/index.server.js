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

	ReactDOMServer.renderToStaticMarkup(jsx); // renderToStaticMarkup으로 한번 렌더링합니다.
	store.dispatch(END);

	try {
		await sagaPromise;
		console.log('preloadContext', preloadContext);
		await Promise.all(preloadContext.promises); // 모든 프로미스를 기다립니다.
		console.log('preload store state >> ', store.getState());
	} catch (e) {
		return res.staus(500);
	}

	preloadContext.done = true;
	const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고

	const stateString = JSON.stringify(store.getState()).replace(/</g, '\\u003c');
	const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`; // 리덕스 초기 상태를 스크립트로 주입합니다.

	const tags = {
		scripts: stateScript + extractor.getScriptTags(),
		links: extractor.getLinkTags(),
		styles: extractor.getStyleTags(),
	};
	res.send(createPage(root, tags)); // 클라이언트에게 결과물을 응답합니다.
};

const serve = express.static(path.resolve('./build'), {
	index: false, // "/" 경로에서 index.html 을 보여주지 않도록 설정
});

app.use(serve);
app.use(serverRender);

const port = process.env.PORT | 3333;

app.listen(port, () => {
	console.log('HTTP Server is Running on Port >> ' + port);
});
