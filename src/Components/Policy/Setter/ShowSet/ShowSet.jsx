import React from 'react'
import { Table ,Badge, Button} from 'antd';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { postRequest } from '../../../../Tools/netRequest';
import { errorInfo } from '../../../../Tools/Message';
import { initGroup, selectCurrGroup} from '../SetterSlice';
import styles from './ShowSet.module.css';
import { Link } from 'react-router-dom';



export default function ShowSet() {
  
    

    const dispatch = useDispatch();
    const currGroup = useSelector(selectCurrGroup);
    

    const handleItem = (data)=>{
        if(data){
            return data.map((item)=>{
                        const startDate = new Date(item.time.start);
                        const endDate = new Date(item.time.end);
                        return {
                            key:`${item.id}-policyGroup`,   
                            id:item.id,
                            start:item.time.start,
                            end:item.time.end,
                            total:item.total,
                            state:{...item.state,id:item.id},
                            starttimestamp:Date.parse(startDate),
                            endtimestamp:Date.parse(endDate),
                        }
                    });
        }
        return [];
    }

    const handleState = (text)=>{
        if(text.code === 0){
            return (
                <div>
                    <Badge status="processing"/> 
                    <Button type='link' className={styles.policyBtn} size="small">
                    <Link to={`/Policy/${text.id}`} target="_blank">
                    {text.msg}
                    </Link>
                    </Button>
                </div>
            );
        }
        if(text.code === 1){
            return (
                <div>
                    <Badge status="success" />
                    <Button type='link' className={styles.policyBtn} size="small">
                    <Link to={`/Policy/${text.id}`} target="_blank">
                    {text.msg}
                    </Link>
                    </Button>
                </div>
            );
        }
        if(text.code === 2){
            return (
                <div>
                <Badge status="error" />
                <Button type='link' className={styles.policyBtn} size="small">
                <Link to={`/Policy/${text.id}`} target="_blank">
                {text.msg}
                </Link>
                </Button>
                </div>
            );
        }

        return (
            <div>
            <Badge status="default" />
            <Button type='link' size="small">未知</Button>
            </div>
        );
    }

    const handleId = (text)=>{
        if(text.length<10){
            return <span>{text}</span>
        }else{
            return <span>{text.substring(0,5)}...{text.substring(text.length-5)}</span>
        }
    }

    const columns = [
        {
          title:'策略组编号',
          dataIndex:'id',
          render:handleId,
        },
        {
          title:'策略开始时间',
          dataIndex:'start',
          sorter:(a,b)=>{return a.starttimestamp-b.starttimestamp},
        },
        {
            title:'策略终止时间',
            dataIndex:'end',
            sorter:(a,b)=>{return a.endtimestamp-b.endtimestamp},
        },
        {
          title:'交易总金额',
          dataIndex:'total',
          render:(text)=>{return <span>￥{text}</span>},
          sorter:(a,b)=>{return a.total-b.total},
        },
        {
            title:'状态&操作',
            dataIndex:'state',
            render:handleState,
        },
    ];

    useEffect(()=>{
        postRequest('initpolicy',{})
        .then((data)=>{
            if(data.state === false){
                return errorInfo('初始化策略组列表失败');
            }
            dispatch(initGroup(data.myPolicy));
        })
        .catch((err)=>{
            console.log(err);
        });
    },[]);

    return (
        <div className="mainShowPolicySetter">
            <Table
            className={styles.showtable}
            columns={columns}
            dataSource={handleItem(currGroup)}
            size='middle'         
            locale={{
                triggerDesc: '',
                triggerAsc: '',
                cancelSort: '',
            }}
            />
        </div>
  )
}
