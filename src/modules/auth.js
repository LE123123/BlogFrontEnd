import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
	createRequestActionTypes,
} from '../lib/api/createRequestSaga';
import * as authAPI from '../lib/api/auth';

const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] =
	createRequestActionTypes('auth/REGISTER');

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] =
	createRequestActionTypes('auth/LOGIN');

const INIT_AUTH = 'auth/INITIALIZE_AUTH';

export const changeField = createAction(
	CHANGE_FIELD,
	({ form, key, value }) => ({
		form, // register, login
		key, // username, password, passwordConfirm
		value, // 실제 바꾸려는 값
	}),
);

export const initializeForm = createAction(INITIALIZE_FORM, (form) => form); // register

export const register = createAction(REGISTER, ({ username, password }) => ({
	username,
	password,
}));

export const login = createAction(LOGIN, ({ username, password }) => ({
	username,
	password,
}));

export const initAuth = createAction(INIT_AUTH);

// 사가 생성
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
export function* authSaga() {
	yield takeLatest(REGISTER, registerSaga);
	yield takeLatest(LOGIN, loginSaga);
}

const initialState = {
	register: {
		username: '',
		password: '',
		passwordConfirm: '',
	},
	login: {
		username: '',
		password: '',
	},
	auth: null,
	authError: null,
};

const auth = handleActions(
	{
		[CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
			produce(state, (draft) => {
				draft[form][key] = value; // 예: state.register.username을 바꾼다.
			}),
		[INITIALIZE_FORM]: (state, { payload: form }) => ({
			...state,
			[form]: initialState[form],
		}),
		// 회원가입 성공
		[REGISTER_SUCCESS]: (state, { payload: auth }) => ({
			...state,
			authError: null,
			auth,
		}),
		[REGISTER_FAILURE]: (state, { payload: error }) => ({
			...state,
			authError: error,
		}),
		[LOGIN_SUCCESS]: (state, { payload: auth }) => ({
			...state,
			authErorr: null,
			auth,
		}),
		[LOGIN_FAILURE]: (state, { payload: error }) => ({
			...state,
			authError: error,
		}),
		[INIT_AUTH]: (state) => ({
			...state,
			auth: null,
		}),
	},
	initialState,
);

export default auth;
