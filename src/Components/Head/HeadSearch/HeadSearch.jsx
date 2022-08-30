import React from "react";
import {Input, message} from "antd";
import { useState } from "react";
import {useDispatch} from "react-redux";

import SearchInfo from "./SearchInfo/SearchInfo";
import {change} from '../../../AppSlice';
import { postRequest } from "../../../Tools/netRequest";


import styles from './HeadSearch.module.css';

const {Search} = Input;
let timeout = null;

const HeadSearch = ()=>{
    const [inputState, setInputState] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [searchOption, setSearchOption] = useState([]);

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

    const handleChange = async(event)=>{
        //防抖
        if(timeout){
            clearTimeout(timeout);
            timeout=null;
        }
        const currValue = event.target.value;
        setInputValue(currValue);

        const reqSuggest = async()=>{
            try{
                const resData = await postRequest('searchInfo',{content:currValue});
                setSearchOption(resData);
            }catch(err){
                console.log(err);
            }
        }
        setTimeout(reqSuggest,300);
    }

    const handleFocus = async()=>{
        setInputState(true);
        try{
            const resData = await postRequest('searchInfo',{content:inputValue});
            setSearchOption(resData);
        }catch(err){
            console.log(err);
        }
    }

    const handleBlur = ()=>{
        setTimeout(()=>{
            setInputState(false);
        },250);
    }

    const showSearchInfo = (type = false)=>{
        if(type === true){
            return (
                <div className={styles.info}>
                    <SearchInfo searchOption={searchOption}/>
                </div>
            );
        }
    }

    return (
            <div className="head-search">
            <div className={styles.search}>
            <Search
            placeholder="搜索股票 仅支持港股标的证券"
            value={inputValue}
            allowClear
            onSearch={handleSearch}
            onChange={handleChange}
            enterButton
            onBlur={handleBlur}
            onFocus={handleFocus}
            />
            </div>
            {showSearchInfo(inputState)}
            </div>
    );
};

export default HeadSearch;