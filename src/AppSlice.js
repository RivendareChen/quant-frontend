import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { changeInputState} from "./Components/Head/HeadSearch/HeadSearchSlice";

export const currStockSlice = createSlice({
    name: 'CurrStock',
    initialState:{
        value:'00001',
    },
    reducers:{
        init: (state)=>{
            state.value = 'init 00001';
        },
        change: (state, action)=>{
            state.value = 'change to '+ action.payload;   
        }
    }
});

export const {init, change} = currStockSlice.actions;

export const selectCurrStock = (store)=>{
    return store.currStock.value;
};

export const searchStock = (code, target)=>{
    return async(dispatch)=>{
        try{
            const {data} = await axios.post('http://localhost:3000/search',{code:code});
            if(data.state === true){
                dispatch(changeInputState(true));
                dispatch(change(data.code));
                console.log('ok');
            }else{
                dispatch(changeInputState(false));
                target.value = '';
                console.log('bad');
            }
        }
        catch(err){
            console.log(err);
        }
    }
};

export default currStockSlice.reducer;