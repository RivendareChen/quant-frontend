import React from "react";
import {Input, message} from "antd";

import {useDispatch} from "react-redux";
import {change} from '../../../AppSlice';
import { postRequest } from "../../../Tools/netRequest";


import './HeadSearch.less';

const {Search} = Input;

const HeadSearch = ()=>{
    const dispatch = useDispatch();

    // const successInfo = (msg)=>{
    //     message.success({content:msg,style:{marginTop:'220px',},duration:1});
    // };

    const warningInfo = (msg)=>{
        message.warning({content:msg,style:{marginTop:'220px',},duration:1});
    };

    const errorInfo = (msg)=>{
        message.error({content:msg,style:{marginTop:'220px',},duration:1});
    };

    const handleSearch = async(value,event)=>{
        if(value!==''){
            try{
                const data = await postRequest('search', {code:value});
                if(data.state === true){
                    dispatch(change(data.code));
                }
                else{
                    event.target.value = '';
                    warningInfo(data.msg)
                }
            }catch(err){
                errorInfo('网络拥塞，请稍后再试',1);
            }
        }
    }

    return (

            <Search
            className="head-search"
            placeholder="搜索股票 仅支持港股"
            allowClear
            onSearch={handleSearch}
            enterButton
            />
    );
};

export default HeadSearch;