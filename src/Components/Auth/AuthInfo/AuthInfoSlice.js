import { createSlice } from "@reduxjs/toolkit";

export const AuthInfoSlice = createSlice({
    name: 'AuthInfo',
    initialState:{
        type: '',
        msg:'',
        info:'',
    },
    reducers:{
        init: (state)=>{
            state.type = '';
            state.msg = '';
            state.info = '';
        },
        success: (state, action)=>{
            const {msg, info} = action.payload;
            state.type = 'success';
            state.msg = msg+'成功';
            state.info = info;
        },
        error: (state, action)=>{
            const {msg, info} = action.payload; 
            state.type = 'error';
            state.msg = msg+'失败';
            state.info = info;
        },
    }
});

export const {init, success, error} = AuthInfoSlice.actions;


export const selectType = (store)=>{
    return store.authInfo.type;
};

export const selectMsg = (store)=>{
    return store.authInfo.msg;
};

export const selectInfo = (store)=>{
    return store.authInfo.info;
};

export default AuthInfoSlice.reducer;