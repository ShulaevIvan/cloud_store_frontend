import { createSlice } from '@reduxjs/toolkit'

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
            state.userFiels = [...state.userFiels, JSON.parse(action.payload)]
        },
        replaceUserFiles(state, action) {
            state.userFiels = [...JSON.parse(action.payload)] 
        },
        removeUserFile(state, action) {
            state.userFiels = state.userFiels.filter((item) => Number(item.id) !== Number(action.payload));
        },
        renameUserFile(state, action) {
            const data = JSON.parse(action.payload);
            state.userFiels = state.userFiels = Array.from(state.userFiels).map((item) => {
                if (Number(item.id) === Number(data.id)) {
                    return {
                        ...item,
                        file_name: data.file_name,
                    }
                }
                return item
            });
        }
    }
});


export const {  authenticateUser, logoutUser, saveUserData, addUserFiles, replaceUserFiles, removeUserFile, renameUserFile } = userSlice.actions;
export default userSlice.reducer;