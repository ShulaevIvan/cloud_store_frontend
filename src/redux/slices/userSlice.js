import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    userData: undefined,
    userAuthenticated: false,
    userFiels: [],
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
        addUserFiles(state, action) {
            state.userFiels = [...state.userFiels, JSON.parse(action.payload)]
        }
    }
});


export const {  authenticateUser, logoutUser, saveUserData, addUserFiles } = userSlice.actions;
export default userSlice.reducer;