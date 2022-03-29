import React from 'react';
import Responsive from '../components/common/Responsive';
import EditorContainer from '../containers/write/EditorContainer';
import TagBoxContainer from '../containers/write/TagBoxContainer';
import WriteActionButtonContainer from '../containers/write/WriteActionButtonContainer';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const WritePage = () => {
	return (
		<Responsive>
			<Helmet>
				<title>글 작성하기 - REACTERS</title>
			</Helmet>
			<EditorContainer />
			<TagBoxContainer />
			<WriteActionButtonContainer navigate={useNavigate()} />
		</Responsive>
	);
};

export default WritePage;
