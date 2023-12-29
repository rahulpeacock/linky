import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UrlState {
	updateUrl: {
		loading: boolean;
	};
}

const initialState: UrlState = {
	updateUrl: {
		loading: false,
	},
};

const slice = createSlice({
	name: 'url',
	initialState,
	reducers: {
		setupdateurl: (state, action: PayloadAction<Partial<UrlState['updateUrl']>>) => {
			state.updateUrl = {
				...state.updateUrl,
				...action.payload,
			};
		},
	},
});

export const { setupdateurl } = slice.actions;
export default slice.reducer;
