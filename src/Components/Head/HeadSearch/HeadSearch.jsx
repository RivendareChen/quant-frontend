import React from "react";
import {Input} from "antd";

import {useDispatch} from "react-redux";
import {searchStock} from '../../../AppSlice';


import './HeadSearch.less';

const {Search} = Input;

const HeadSearch = ()=>{
    const dispatch = useDispatch();

    const handleSearch = (value,event)=>{
        if(value!==''){
            dispatch(searchStock(value, event.target));
        }
    }

    return (

            <Search
            className="head-search"
            placeholder="搜索股票"
            allowClear
            onSearch={handleSearch}
            enterButton
            />
    );
};

export default HeadSearch;