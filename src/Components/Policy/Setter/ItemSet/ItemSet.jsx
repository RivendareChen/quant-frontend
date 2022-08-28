import React from 'react'
import { useState } from 'react'
import { Input, Select, Cascader, Button, Switch} from 'antd';
import { useDispatch } from 'react-redux';

import {add} from '../SetterSlice';
import { errorInfo} from "../../../../Tools/Message.js";
import { postRequest } from '../../../../Tools/netRequest';

import styles from './ItemSet.module.css'

const {Option} = Select;

const cascaderOption = [
    {
        value:0,
        label:'MA',
        children:[
            {value: 0, label:'低于'},
            {value: 1, label:'高于'},
            {value: 2, label:'跌变涨'},
            {value: 3, label:'涨变跌'},
            {value: 4, label:'盘整'},
        ]
    },
    {
        value:1,
        label:'MACD',
        children:[
            {value: 0, label:'金叉'},
            {value: 1, label:'死叉'},
            {value: 2, label:'顶背离'},
            {value: 3, label:'底背离'},
        ]
    },
    {
        value:2,
        label:'K线',
        children:[
            {value: 0, label:'低于'},
            {value: 1, label:'高于'},
            {value: 2, label:'跌变涨'},
            {value: 3, label:'涨变跌'},
            {value: 4, label:'盘整'},
        ]
    },
    {
        value:3,
        label:'RSI',
        children:[
            {value: 0, label:'低于'},
            {value: 1, label:'高于'},
        ]
    }
];

export default function ItemSet() {

    const [stockCode, setStockCode] = useState('');
    const [amount, setAmount] = useState({type:0,value:''});
    const [operaType, setOperaType] = useState(true);
    const [condition, setCondition] = useState([]);
    const [conditionValue, setConditionValue] = useState('');

    const dispatch = useDispatch();

    const disableConditionInput = ()=>{
        if(!condition)return true;
        if(condition===[])return true;
        const first = condition[0];
        const second = condition[1];
        if((first=== 0||first===2||first===3) && (second===0||second===1)){
            return false;
        }
        return true;
    }


    const disableAddButton = ()=>{
        if(!stockCode || !amount || !condition){
            return true;
        }
        if(stockCode === '')return true;
        if(amount.value === '')return true;
        if(condition === [])return true;


        const first = condition[0];
        const second = condition[1];
        if((first=== 0||first===2||first===3) && (second===0||second===1)){
            if(conditionValue==='')return true;
        }
        return false;
    }

    const handleAddPolicy = ()=>{
        const data = {
            code:stockCode,
            amount:amount,
            condition:condition,
            conditionValue:conditionValue,
            type:operaType,
        }
        postRequest('checkPolicyItem',data)
        .then((res)=>{
            if(res.state){
                dispatch(add(data));
            }
            else{
                errorInfo(res.msg);
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    const handleSwitchColor = (type)=>{
        if(type === true){
            return '#F9293E';
        }
        else{
            return '#00AA3B';
        }
    }

    return (
        <div className="mainItemStterDiv">
               
            <Input className={styles.stockInput}
            value={stockCode}
            placeholder="请输入目标股票代码"
            onChange={(e)=>setStockCode(e.target.value)}
            allowClear
            // style={{width:'70%'}}
            />

            <Input.Group compact className={styles.amountInput}>
                <Select 
                    defaultValue={0}
                    onChange={(value)=>setAmount({type:value,value:''})}
                    style={{width:'50%'}}
                >
                <Option value={0}>总金额</Option>
                <Option value={1}>总数量</Option>
                </Select>
                <Input
                value={amount.value}
                placeholder="请输入数值"
                onChange={(e)=>{setAmount({type:amount.type,value:e.target.value.replace(/[^\-?\d.]/g,'')})}}
                style={{width:'50%'}}
                allowClear
                />
            </Input.Group>
            
            <Input.Group compact className={styles.conditionDiv}>
            <Cascader
                options={cascaderOption}
                placeholder="策略条件"
                onChange={(value)=>{
                    setCondition(value);
                    setConditionValue('');
                }}
                style={{width:'50%'}}
                allowClear={false}
            />
            <Input
            placeholder='请输入阈值'
            value={conditionValue}
            disabled={disableConditionInput()}
            onChange={(e)=>{setConditionValue(e.target.value.replace(/[^\-?\d.]/g,''))}}
            style={{width:'50%'}}
            allowClear
            />
            </Input.Group>
            
            <div className={styles.setterSwitchDiv}>
            <Switch
             className={styles.buysaleSwitch}
             checkedChildren="买入" 
             unCheckedChildren="卖出"
             style={{backgroundColor:handleSwitchColor(operaType)}}
             onChange={()=>setOperaType(!operaType)}
             defaultChecked />
            </div>

            <Button
            className={styles.buttonDiv}
            type='link'
            disabled={disableAddButton()}
            onClick={handleAddPolicy}
            >添加策略</Button>

        </div>
    )
}
