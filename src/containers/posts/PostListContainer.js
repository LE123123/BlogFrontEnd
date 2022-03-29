import React, { useEffect } from 'react';
import qs from 'qs';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../../components/posts/PostList';
import { listPosts } from '../../modules/posts';
import { useParams, useLocation } from 'react-router-dom';
import { usePreloader } from '../../lib/PreloadContext';

const PostListContainer = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { username } = useParams();

	const { posts, error, loading, user } = useSelector(
		({ posts, loading, user }) => ({
			posts: posts.posts,
			error: posts.error,
			loading: loading['posts/LIST_POSTS'],
			user: user.user,
		}),
	);

	const { tag, page } = qs.parse(location.search, {
		ignoreQueryPrefix: true,
	});

	useEffect(() => {
		dispatch(listPosts({ tag, page, username }));
	}, [dispatch, username, tag, page]);

	usePreloader(() => dispatch(listPosts({ tag, page, username })));

	// 만약 posts가 없다면 return null
	if (!posts) return null;

	return (
		<>
			<PostList
				loading={loading}
				error={error}
				posts={posts}
				showWriteButton={user}
			/>
		</>
	);
};

export default PostListContainer;
