import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../components/common/Header';
import { logout } from '../../modules/user';
import { initAuth } from '../../modules/auth';

const HeaderContainer = () => {
	const dispatch = useDispatch();
	// 서버 사이드 렌더링에서 이미 user가 렌더링 될 수 있어서 hydrate할 때 이상하게 나옴

	const { user } = useSelector(({ user }) => ({ user: user.user }));

	const onLogout = () => {
		dispatch(logout());
		dispatch(initAuth());
	};
	return <Header user={user} onLogout={onLogout} />;
};

export default HeaderContainer;
