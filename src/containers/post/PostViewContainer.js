/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { readPost, unloadPost } from '../../modules/post';
import PostView from '../../components/post/PostView';
import { useParams } from 'react-router-dom';
import PostActionButtons from '../../components/post/PostActionButtons';
import { setOriginalPost } from '../../modules/write';
import { useNavigate } from 'react-router-dom';
import { removePost } from '../../lib/api/posts';

const PostViewContainer = () => {
	const navigate = useNavigate();
	// 처음 마운트 될 때 포스트 읽기 API요청
	const { postId } = useParams();
	const dispatch = useDispatch();

	const { post, error, loading, user } = useSelector(
		({ post, loading, user }) => ({
			post: post.post,
			error: post.error,
			loading: loading['post/READ_POST'],
			user: user.user,
		}),
	);

	useEffect(() => {
		dispatch(readPost(postId));

		// 언마운트될 떄 리덕스에서 포스트 데이터 없애기
		return () => {
			dispatch(unloadPost());
		};
	}, [dispatch, postId]);

	const onEdit = () => {
		dispatch(setOriginalPost(post));
		navigate('/write');
	};

	const onRemove = async () => {
		try {
			await removePost(postId);
			navigate('/');
		} catch (e) {
			console.log(e);
		}
	};

	const ownPost = (user && user._id) === (post && post.user._id);
	return (
		<PostView
			post={post}
			loading={loading}
			error={error}
			actionButtons={
				ownPost && <PostActionButtons onEdit={onEdit} onRemove={onRemove} />
			}
		/>
	);
};

export default PostViewContainer;
