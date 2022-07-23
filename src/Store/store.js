import { configureStore } from "@reduxjs/toolkit";
import currStockReducer from '../AppSlice.js';
import headSearchReducer from '../Components/Head/HeadSearch/HeadSearchSlice.js';

export default configureStore({
    reducer:{
        //key值xxx要与Slice.js中的select.xxx.value对应
        currStock:currStockReducer,
        headSearch: headSearchReducer,
    },
});