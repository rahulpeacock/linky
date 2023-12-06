import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ClientState {
	id: string | null;
}

const initialState: ClientState = {
	id: null,
};

const slice = createSlice({
	name: 'client',
	initialState,
	reducers: {
		setid: (state, action: PayloadAction<Partial<ClientState['id']>>) => {
			state.id = action.payload;
		},
	},
});

export const { setid } = slice.actions;
export default slice.reducer;
