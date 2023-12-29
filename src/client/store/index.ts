import { Action, combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import authReducer from './slices/auth-slice';
import clientReducer from './slices/client-slice';
import urlReducer from './slices/url-slice';

const rootReducer = combineReducers({
	clientSlice: clientReducer,
	authSlice: authReducer,
	urlSlice: urlReducer,
});

export const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;

export const dispatch = (action: Action) => store.dispatch(action);
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
