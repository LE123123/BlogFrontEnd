import client from './client';
import qs from 'qs';

// EC2
client.defaults.baseURL = `https://boiling-castle-28671.herokuapp.com`;
client.defaults.withCredentials = 'include';

export const writePost = ({ title, body, tags }) =>
	client.post('/api/posts', { title, body, tags });

export const readPost = (id) => client.get(`/api/posts/${id}`);

export const listPosts = ({ page, username, tag }) => {
	const queryString = qs.stringify({
		page,
		username,
		tag,
	});
	return client.get(`/api/posts?${queryString}`);
};

export const updatePost = ({ id, title, body, tags }) =>
	client.patch(`/api/posts/${id}`, {
		title,
		body,
		tags,
	});

export const removePost = (id) => client.delete(`/api/posts/${id}`);
