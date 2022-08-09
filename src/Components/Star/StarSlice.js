import { createSlice } from "@reduxjs/toolkit";

export const currStarSlice = createSlice({
    name:'currStar',
    initialState:{
        value:{
            total:{
                name:'全部股票',
                children:[],
            },
            folders:[],
        },
    },
    reducers:{
        init: (state, action)=>{
            state.value = action.payload;
        },

        star: (state, action)=>{
            const code = action.payload;
            const totalArray = state.value.total.children;
            const foldersArray = state.value.folders;
            const index = totalArray.findIndex((item)=>item===code);
            if(index>=0){
                //删除 ‘全部’ 中的股票
                totalArray.splice(index,1);  
                //删除各子文件夹中的股票
                foldersArray.map((item)=>{
                    const curr = item.children.findIndex((curr)=>curr===code);
                    if(curr>=0){
                        item.children.splice(index,1);
                    }
                })
            }
            else{
                totalArray.push(code);
            }
        }
    }
});

export const {init, star} = currStarSlice.actions;

export const selectCurrStar = (store)=>{
    return store.currStar.value;
}

export default currStarSlice.reducer;