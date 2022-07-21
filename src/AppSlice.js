import { createSlice } from "@reduxjs/toolkit";

export const AppSlice = createSlice({
    name: 'App',
    initialState:{
        value:'00001',
    },
    reducers:{
        init: (state)=>{
            state.value = '00001';
        },

        change: (state, action)=>{
            state.value = action.payload;
        }
    }
});

export const {init, change} = AppSlice.actions;

export const selectApp = (state)=>{
    return state.App.value;
}

export default AppSlice.reducer;