import React from 'react'
import { Table,Descriptions,Empty,Tag} from 'antd';
import { useState ,useEffect} from 'react';

import { postRequest } from '../../../../Tools/netRequest';
import { errorInfo } from '../../../../Tools/Message';
import styles from './TradeDetail.module.css';

const columns = [
    {
      title:'股票名称',
      dataIndex:'code',
    },
    {
        title:'交易单价&数量',
        dataIndex:'PriceAndNum',
        render:(item)=>{
            return (
                <div>
                    以￥{item.price}{item.quantity}股
                </div>
            );
        }
    },
    {
      title:'交易时间',
      dataIndex:'time',
      sorter:(a,b)=>{return a.timestamp-b.timestamp},
    },
    {
      title:'交易金额',
      dataIndex:'total',
      render:(text)=>{return <span>￥{text}</span>},
      sorter:(a,b)=>{return a.total-b.total},
    }
];



export default function TradeDetail(props) {
    const [detailData, setDetailData] = useState(null);

    const handleDetailData = ()=>{
        if(detailData!==null)
            return detailData.details.map((item,index)=>{
                const date = new Date(item.time);
                return {
                    key:`${props.tradeId}-detail-${index}`,
                    code: item.code,
                    PriceAndNum:{price:item.price,quantity:item.quantity},
                    time: item.time,
                    total: item.total,
                    timestamp:Date.parse(date),
                }
            });
    }

    const showStateTag = ()=>{
        if(detailData === null)return;
        const {state} = detailData.info;
        console.log(state);
        let color = 'yellow';
        if(state.code === 0){
            color = 'green';
        }
        else if(state.code === 1){
            color = 'red';
        }
        return (
            <Tag color={color}>
                {state.msg}
            </Tag>
        );
    }

    const showDetail = ()=>{
        if(props.tradeId === null || detailData===null){
            return (
                <div className='TradeDetailMain'>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="尚未选择交易订单"></Empty>
                </div>
            );
        }
        else{
            return (
                <div className='TradeDetailMain'>
                <Descriptions title={<div className={styles.titleDiv}>交易详情</div>} bordered size='small'>
                <Descriptions.Item label="订单编号" >{detailData.info.name}</Descriptions.Item>
                <Descriptions.Item label="交易类型" span={2}>{detailData.info.type}</Descriptions.Item>
                <Descriptions.Item label="交易人" span={1}>{detailData.username}</Descriptions.Item>
                <Descriptions.Item label="交易金额" span={1}>￥{detailData.info.total}</Descriptions.Item>
                <Descriptions.Item label="交易状态" span={1}>{showStateTag()}</Descriptions.Item>
                <Descriptions.Item label="策略设置时间">{detailData.info.startTime}</Descriptions.Item>
                <Descriptions.Item label="策略触发时间">{detailData.info.tradeTime}</Descriptions.Item>
                </Descriptions>
                <Table
                columns={columns}
                dataSource={handleDetailData()}
                locale={{
                    triggerDesc: '',
                    triggerAsc: '',
                    cancelSort: '',
                }}
                />
                </div>
            );
        }
    }
    

    useEffect(()=>{
        if(props.tradeId!==null){
            postRequest('tradeDetail',{name:props.tradeId})
            .then((data)=>{
                if(data.login === false){
                    return errorInfo('获取数据失败');
                }
                // console.log(data);
                setDetailData(data);
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    },[props.tradeId]);


    return (
        <>
        {showDetail()}
        </>
    );
}
