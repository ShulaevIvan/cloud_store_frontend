import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    userData: undefined,
    userAuthenticated: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authenticateUser(state) {
            state.userAuthenticated = true;
        },
        logoutUser(state) {
            state.userAuthenticated = false;
        },
        saveUserData(state, action) {
            state.userData = action.payload;
        },
    }
});

export const {  authenticateUser, logoutUser, saveUserData } = userSlice.actions;
export default userSlice.reducer;