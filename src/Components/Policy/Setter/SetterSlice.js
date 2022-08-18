import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";



export const currPolicySlice = createSlice({
    name:'currPolicy',
    initialState:{
        policys:[],
        groups:[],
    },
    reducers:{
        init: (state)=>{
            state.policys = [];
        },

        add:(state,action)=>{
            const policy = action.payload;
            policy.key = nanoid();
            state.policys.unshift(policy);
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
        },

        initGroup:(state,action)=>{
            state.groups = action.payload;
        },

        addGroup: (state, action)=>{
            state.groups.unshift(action.payload);
        }
    }
});

export const {init, add, remove, initGroup, addGroup} = currPolicySlice.actions;

export const selectCurrPolicy = (store)=>{
    return store.currPolicy.policys;
}

export const selectCurrGroup = (store)=>{
    return store.currPolicy.groups;
}

export default currPolicySlice.reducer;