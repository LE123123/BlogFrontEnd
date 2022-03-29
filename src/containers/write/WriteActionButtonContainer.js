import React, { useEffect } from 'react';
import WriteActionButton from '../../components/write/WriteActionButton';
import { useSelector, useDispatch } from 'react-redux';
import { writePost, updatePost } from '../../modules/write';

const WriteActionButtonContainer = ({ navigate }) => {
	const dispatch = useDispatch();
	const { title, body, tags, post, postError, originalPostId } = useSelector(
		({ write: { title, body, tags, post, postError, originalPostId } }) => ({
			title,
			body,
			tags,
			post,
			postError,
			originalPostId,
		}),
	);

	// 포스트 등록
	const onPublish = () => {
		if (originalPostId) {
			dispatch(updatePost({ title, body, tags, id: originalPostId }));
		} else {
			dispatch(
				writePost({
					title,
					body,
					tags,
				}),
			);
		}
	};

	// 취소
	const onCancel = () => {
		navigate(-1);
	};

	// 성공 혹은 실패 시 할 작업
	useEffect(() => {
		if (post) {
			const { _id, user } = post;
			navigate(`/@${user.username}/${_id}`);
		}
		if (postError) {
			console.log(postError);
		}
	}, [navigate, post, postError]);

	return (
		<WriteActionButton
			onPublish={onPublish}
			onCancel={onCancel}
			isEdit={!!originalPostId}
		/>
	);
};

export default WriteActionButtonContainer;
