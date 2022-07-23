import { createSlice } from "@reduxjs/toolkit";

export const headSearchSlice = createSlice({
    name: 'HeadSearch',
    initialState:{
        value: false,
    },
    reducers:{
        changeInputState: (state, action)=>{
            state.value = action.payload;
        }
    }
});

export const {changeInputState} = headSearchSlice.actions;

export const selectInputState = (store)=>{
    return store.headSearch.value;
};

export default headSearchSlice.reducer;