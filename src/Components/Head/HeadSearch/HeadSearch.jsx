import React from "react";
import {Input} from "antd";

import { useDispatch } from "react-redux";
import {change} from '../../../AppSlice';


import './HeadSearch.less';

const {Search} = Input;



const HeadSearch = ()=>{
    const dispatch = useDispatch();

    const handleSearch = (value)=>{
        if(value!==''){
            dispatch(change(value));
        }
    };

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