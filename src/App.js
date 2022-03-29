import './App.css';
import { Routes, Route } from 'react-router';
import { Helmet } from 'react-helmet-async';
import loadable from '@loadable/component';

const PostListPage = loadable(() => import('./pages/PostListPage'));
const RegisterPage = loadable(() => import('./pages/RegisterPage'));
const LoginPage = loadable(() => import('./pages/LoginPage'));
const WritePage = loadable(() => import('./pages/WritePage'));
const PostPage = loadable(() => import('./pages/PostPage'));

function App() {
	return (
		<div>
			<Helmet>
				<title>REACTERS</title>
			</Helmet>
			<Routes>
				<Route path={'/@:username'} element={<PostListPage />} />
				<Route path={'/'} element={<PostListPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/write" element={<WritePage />} />
				<Route path="/@:username/:postId" element={<PostPage />} />
			</Routes>
		</div>
	);
}

export default App;
