import { createSlice } from "@reduxjs/toolkit";

export const currStockSlice = createSlice({
    name: 'CurrStock',
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

export const {init, change} = currStockSlice.actions;

export const selectCurrStock = (store)=>{
    return store.currStock.value;
};

export default currStockSlice.reducer;