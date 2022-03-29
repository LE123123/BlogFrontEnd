import React from 'react';
import PostListContainer from '../containers/posts/PostListContainer';
import HeaderContainer from '../containers/common/HeaderContainer';
import PaginationContainer from '../containers/posts/PaginationContainer';

const PostListPage = () => {
	return (
		<div>
			<HeaderContainer />
			<PostListContainer />
			<PaginationContainer />
		</div>
	);
};

export default PostListPage;
