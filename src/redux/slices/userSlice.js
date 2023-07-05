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
            state.userFiels = [];
        },
        saveUserData(state, action) {
            state.userData = action.payload;
        },
        addUserFiles(state, action) {
            state.userFiels = state.userFiels.length === 1 ? [...state.userFiels[0], JSON.parse(action.payload)] : [...state.userFiels, JSON.parse(action.payload)]
        },
        replaceUserFiles(state, action) {
            state.userFiels = [JSON.parse(action.payload)] 
        },
        removeUserFile(state, action) {
            state.userFiels = state.userFiels.filter((item) => item.id !== action.payload)
        }
    }
});


export const {  authenticateUser, logoutUser, saveUserData, addUserFiles, replaceUserFiles, removeUserFile } = userSlice.actions;
export default userSlice.reducer;