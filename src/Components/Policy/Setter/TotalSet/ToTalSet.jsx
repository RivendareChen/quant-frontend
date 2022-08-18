import React from 'react'
import { List, DatePicker , Input, Button, Popconfirm, Tag} from 'antd'
import {DeleteFilled} from '@ant-design/icons';
import { useSelector, useDispatch} from 'react-redux';
import { useState } from 'react';
import 'moment';

import {selectCurrPolicy} from '../SetterSlice.js';
import { remove,init, addGroup } from '../SetterSlice.js';
import styles from './TotalSet.module.css';
import { postRequest } from '../../../../Tools/netRequest.js';
import { errorInfo, successInfo} from '../../../../Tools/Message.js';
const {RangePicker} = DatePicker

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

export default function ToTalSet() {

    const [tradeTime, setTradeTime] = useState({start:null,end:null});

    const policyGroup = useSelector(selectCurrPolicy);

    const dispatch = useDispatch();

    const data2Description = (item)=>{
        let description = '当'
        description+=cascaderOption[item.condition[0]].label;
        description+=cascaderOption[item.condition[0]].children[item.condition[1]].label;
        description+=item.conditionValue;
        description+='时，';
        if(item.type === true){
            description+='买入';
        }
        else{
            description+='卖出';
        }
        if(item.amount.type===0){
            description+=`￥${item.amount.value}`;
        }
        else{
            description+=`${item.amount.value}股`;
        }
        return <span>{description}</span>
    }

    const handlePolicyData = (item)=>{
        const buyTitle = (<span><Tag color={'#F9293E'}>买入</Tag>股票{item.code}</span>);
        const saleTitle = (<span><Tag color={'#00AA3B'}>卖出</Tag>股票{item.code}</span>);
        return (
            <List.Item
            actions={[
                <Popconfirm
                title={`确认删除该条策略?`}
                okText="确认"
                cancelText="取消"
                onConfirm={()=>dispatch(remove(item.key))}
                >
                <DeleteFilled 
                 style={{color:'#F9293E'}}
                //  onClick={()=>dispatch(remove(item.key))}
                />
                </Popconfirm>
            ]}
            >
                <List.Item.Meta
                title={item.type?buyTitle:saleTitle}
                description={data2Description(item)}
                />
            </List.Item>
        );
    }

    const disableSubmit = ()=>{
        // console.log(policyGroup,tradeTime);
        
        if(tradeTime.start === null || tradeTime.end === null){
            // console.log(true);
            return true;
        }
        if(!policyGroup || policyGroup.length===0){
            // console.log(policyGroup,true);
            return true;
        }
        // console.log(policyGroup,false);
        return false;
    }

    const handleSubmit = ()=>{
        const postTradeTime = {
            start:tradeTime.start.format('YYYY-MM-DD hh:mm:ss'),
            end:tradeTime.end.format('YYYY-MM-DD hh:mm:ss'),
        }
        console.log(postTradeTime,policyGroup);
        postRequest('setpolicy',{time:postTradeTime,policys:policyGroup})
        .then((resdata)=>{
            if(resdata.success === false){
                return errorInfo(`设置失败: ${resdata.msg}`)
            }
            const data = {
                id:resdata.id,
                total:resdata.total,
                time:resdata.time,
                state:resdata.state,
            };
            // console.log(data);
            dispatch(addGroup(data));
            successInfo('策略组设置成功！');
            dispatch(init());
            setTradeTime({start:null,end:null});
        })
        .catch((err)=>{
            console.log(err);
            errorInfo('请检查网络连接');
        })
    }
    
    return (
        <div>
            <Input.Group compact className={styles.setDiv}>
            <RangePicker 
            showTime
            value={[tradeTime.start,tradeTime.end]}
            style={{width:'70%'}}
            onChange={(dates)=>{
                if(dates){
                    setTradeTime({
                        start:dates[0],
                        end:dates[1],
                    });
                }
                else{
                    setTradeTime({
                        start:null,
                        end:null,
                    })
                }
            }}
            />
            <Button
            style={{width:'30%'}}
            className={styles.compButton}
            type="primary"
            disabled={disableSubmit()}
            onClick={handleSubmit}
            >上传策略组</Button>
            </Input.Group>
            
            <List
            className={styles.listDiv}
            dataSource={policyGroup}
            renderItem={handlePolicyData}
            size="small"
            // header={<div>Header</div>}
            />
        </div>
        
    )
}
