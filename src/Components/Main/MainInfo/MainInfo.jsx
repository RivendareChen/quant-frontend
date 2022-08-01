import React from 'react'
import { Col, Row , Button} from 'antd';
import { useEffect, useState} from 'react';
import {DownloadOutlined, StarOutlined} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCurrStock } from '../../../AppSlice';

import { postRequest } from '../../../Tools/netRequest';
import styles from './MainInfo.module.css';


export default function MainInfo() {
  const currStockCode = useSelector(selectCurrStock);
  
  const [infoData, setInfoData] = useState({});

  useEffect(()=>{
    postRequest('info', {code: currStockCode})
    .then((data)=>{
      setInfoData(data);
    })
    .catch((err)=>{
      console.log(err);
    });
  },[currStockCode]);

  
  return (
    <div className={styles.mainInfoDiv}>
      <Row>
        <Col span={20}>
          <div className={styles.name}>
              <div style={{fontSize:'25px'}}>{infoData.name}{infoData.code}</div>
              <div style={{textAlign:'center'}}>{infoData.en}</div>
          </div>
          <div className={styles.name}>
              <div style={{fontSize:'25px'}}>￥{infoData.price}</div>
              <div style={{textAlign:'center'}}>+{infoData.trend}%</div>
          </div>
          <div className={styles.star}>
            <StarOutlined style={{fontSize:'35px'}} />
          </div>
          <div className={styles.data1}>
              <div>24H最高价</div>
              <div>￥50.01</div>
          </div>
          <div className={styles.data}>
              <div>24H最低价</div>
              <div>￥48.55</div>
          </div>
          <div className={styles.data}>
              <div>24H成交量</div>
              <div>2456</div>
          </div>
        </Col>
        <Col span={4}>
          <Button 
          type='primary' 
          shape='round' 
          icon={<DownloadOutlined/>}
          className={styles.download}
          >
          盘后数据</Button>
        </Col>
      </Row>
    </div>
  )
}
