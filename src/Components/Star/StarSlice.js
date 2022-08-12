import { createSlice } from "@reduxjs/toolkit";
import { successInfo} from "../../Tools/Message";

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
                foldersArray.forEach((item)=>{
                    const curr = item.children.findIndex((curr)=>curr===code);
                    if(curr>=0){
                        item.children.splice(curr,1);
                    }
                })
            }
            else{
                totalArray.push(code);
            }
        },

        addFolder: (state, action)=>{
            const folderArray = state.value.folders;
            folderArray.push({
                name:action.payload,
                children:[],
            });
            successInfo(`新建文件夹${action.payload}`);
        },

        removeFolder: (state, action)=>{
            const folderArray = state.value.folders;
            const name = folderArray[action.payload].name;
            folderArray.splice(action.payload,1);
            successInfo(`删除文件夹: ${name}`);
        },

        removeStar: (state, action)=>{
            const {folderIndex, codeIndex} = action.payload;
            const folder = state.value.folders[folderIndex].children;
            const code = folder[codeIndex];
            folder.splice(codeIndex,1);
            successInfo(`移除股票: ${code}`);
        },

        addStar: (state , action)=>{
            const {folderIndex, codeIndex} = action.payload;
            const folder = state.value.folders[folderIndex].children;
            const code = state.value.total.children[codeIndex];
            folder.push(code);
            successInfo(`添加股票: ${code}`);
        }
    }
});

export const {init, star, findFolder, addFolder, removeFolder, removeStar, addStar} = currStarSlice.actions;

export const selectCurrStar = (store)=>{
    return store.currStar.value;
}

export default currStarSlice.reducer;