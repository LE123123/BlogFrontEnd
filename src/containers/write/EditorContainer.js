import React, { useEffect, useCallback } from 'react';
import Editor from '../../components/write/Editor';
import { useSelector, useDispatch } from 'react-redux';
import { changeField, initialize } from '../../modules/write';

const EditorContainer = () => {
	const dispatch = useDispatch();

	const { title, body } = useSelector(({ write: { title, body } }) => ({
		title: title,
		body: body,
	}));

	const onChangeField = useCallback(
		(payload) => dispatch(changeField(payload)),
		[dispatch],
	);

	// 페이지 언마운트 될 때 리덕스를 초기화 해줘야 한다.
	useEffect(() => {
		return () => {
			dispatch(initialize());
		};
	}, [dispatch]);

	return <Editor onChangeField={onChangeField} title={title} body={body} />;
};

export default EditorContainer;
