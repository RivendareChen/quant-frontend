import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";



export const currPolicySlice = createSlice({
    name:'currPolicy',
    initialState:{
        policys:[],
    },
    reducers:{
        init: (state)=>{
            state.policys = [];
        },

        add:(state,action)=>{
            const policy = action.payload;
            policy.key = nanoid();
            state.policys.push(policy);
        },

        remove:(state, action)=>{
            const key = action.payload;
            const index = state.policys.findIndex((item)=>{
                return item.key === key;
            });
            if(index>=0){
                state.policys.splice(index,1);
            }
            else{
                console.log('未知错误');
            }
        }
    }
});

export const {init, add, remove} = currPolicySlice.actions;

export const selectCurrPolicy = (store)=>{
    return store.currPolicy.policys;
}

export default currPolicySlice.reducer;