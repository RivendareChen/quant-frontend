import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Table } from 'antd';

import { postRequest } from '../../../Tools/netRequest';
import { warningInfo } from '../../../Tools/Message';
import TradeDetail from './TradeDetail/TradeDetail';

import styles from './Trade.module.css';

const columns = [
  {
    title:'交易订单编号',
    dataIndex:'name',
  },
  {
    title:'策略触发时间',
    dataIndex:'time',
    sorter:(a,b)=>{return a.timestamp-b.timestamp},
  },
  {
    title:'交易总金额',
    dataIndex:'total',
    render:(text)=>{return <span>￥{text}</span>},
    sorter:(a,b)=>{return a.total-b.total},
  }
];

export default function Trade() {

  const [infoData, setInfoData] = useState(null);
  const [currSelect, setCurrSelect] = useState(null);

  const handleInfo = (data)=>{
    if(data !== null)
      return data.map((item)=>{
        const date = new Date(item.tradeTime);
        return {
          key:item.name,
          name:item.name,
          time:item.tradeTime,
          timestamp:Date.parse(date),
          total:item.total,
        }
      });
  }

  useEffect(()=>{
    postRequest('tradeInfo', {})
    .then((data)=>{
      const {login, infos} = data;
      if(login === false){
        return warningInfo('用户未登录！');
      }
      setInfoData(infos);
    })
    .catch((err)=>{
      console.log(err);
    })
  },[]);


  
    return (
      <>
      <div className="tradeInfoTotalDiv">
        <Table
        columns={columns}
        dataSource={handleInfo(infoData)}
        className={styles.total}
        size="middle"
        locale={{
          triggerDesc: '',
          triggerAsc: '',
          cancelSort: '',
        }}
        rowSelection={
          {
            type:'radio',
            onChange: (selectedRowKeys) => {
              setCurrSelect(selectedRowKeys[0]);
            },
          }
        }
        />
      </div>
      <div className={styles.detailDiv}>
        <TradeDetail tradeId={currSelect}/>
      </div>
      </>
    )
}
