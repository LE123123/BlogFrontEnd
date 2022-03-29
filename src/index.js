import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { rootSaga } from './modules';
import createSagaMiddleware from '@redux-saga/core';
import { tempSetUser, check } from './modules/user';
import { HelmetProvider } from 'react-helmet-async';
import { loadableReady } from '@loadable/component';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
	rootReducer,
	window.__PRELOADED_STATE__,
	composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

function loadUser() {
	try {
		const user = localStorage.getItem('user');
		if (!user) return;
		store.dispatch(tempSetUser(JSON.parse(user)));
		store.dispatch(check());
	} catch (e) {
		console.log('localStorage is not working');
	}
}

sagaMiddleware.run(rootSaga);
loadUser();

const Root = () => {
	return (
		<Provider store={store}>
			<Router>
				<HelmetProvider>
					<App />
				</HelmetProvider>
			</Router>
		</Provider>
	);
};
const root = document.getElementById('root');

// if (process.env.NODE_ENV === 'production') {
// 	loadableReady(() => {
// 		ReactDOM.hydrate(<Root />, root);
// 	});
// } else {
ReactDOM.render(<Root />, root);
// }
