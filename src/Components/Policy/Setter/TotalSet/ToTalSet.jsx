import React from 'react'
import { List, DatePicker , Input, Button, Popconfirm, Tag} from 'antd'
import {DeleteFilled} from '@ant-design/icons';
import { useSelector, useDispatch} from 'react-redux';
import 'moment';

import {selectCurrPolicy} from '../SetterSlice.js';
import { remove } from '../SetterSlice.js';
import styles from './TotalSet.module.css';
const {RangePicker} = DatePicker

export default function ToTalSet() {

    const dispatch = useDispatch();

    const handlePolicyData = (item)=>{
        const buyTitle = (<span>股票{item.code}<Tag color={'#F9293E'}>买入</Tag></span>);
        const saleTitle = (<span>股票{item.code}<Tag color={'#00AA3B'}>卖出</Tag></span>)
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
                description={item.key}
                />
            </List.Item>
        );
    }
    
    return (
        <div>
            <Input.Group compact className={styles.setDiv}>
            <RangePicker 
            showTime
            style={{width:'70%'}}
            onChange={(dates)=>{
                if(dates)console.log(dates[0].format('YYYY-MM-DD hh:mm:ss'));
            }}
            />
            <Button
            style={{width:'30%'}}
            className={styles.compButton}
            type="primary"
            >上传策略组</Button>
            </Input.Group>
            
            <List
            className={styles.listDiv}
            dataSource={useSelector(selectCurrPolicy)}
            renderItem={handlePolicyData}
            size="small"
            // header={<div>Header</div>}
            />
        </div>
        
    )
}
