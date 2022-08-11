import React from 'react'
import { Col, Row } from 'antd';
import { useEffect, useState} from 'react';
import {StarOutlined, StarFilled} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrStock } from '../../../AppSlice';
import { selectCurrStar, star } from '../../Star/StarSlice';

import { postRequest } from '../../../Tools/netRequest';
import { errorInfo, successInfo } from '../../../Tools/Message';
import Operate from './Operate/Operate';
import styles from './MainInfo.module.css';


export default function MainInfo() {
  const currStockCode = useSelector(selectCurrStock);
  const currStar = useSelector(selectCurrStar);
  const dispatch = useDispatch();
  
  const [infoData, setInfoData] = useState({});

  const handleStar = ()=>{
      postRequest('star',{code:currStockCode})
      .then((data)=>{
        const {success, state} = data;
        if(state === false){
            errorInfo('登录后启用股票收藏功能');
            return;
        }
        if(success === false){
            errorInfo('操作失败');
            return;
        }
        dispatch(star(currStockCode));
        successInfo('操作成功');

      })
      .catch(()=>{
            errorInfo('请检查网络连接');
      });
  }

  const showPrice = (trend)=>{
    const fontColor = trend>0? '#F9293E':'#00aa3b';
    const trendStr = trend>0? '+'+String(trend):String(trend);
    return (
      <div className={styles.name}>
              <div style={{fontSize:'25px', color:fontColor}}>￥{infoData.price}</div>
              <div style={{textAlign:'center', color:fontColor}}>{trendStr}%</div>
          </div>
    );
  }

  const showStar = (code)=>{
      const index = currStar.total.children.findIndex((item)=>item===code);
      if(index>=0){
          return <StarFilled 
                  style={{fontSize:'35px', color:'yellow'}}
                  onClick={handleStar}
                  />;
      }
      else{
          return <StarOutlined 
                  style={{fontSize:'35px'}}
                  onClick={handleStar}
                 />
      }
  };


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
        <Col span={16}>
          <div className={styles.name}>
              <div style={{fontSize:'25px'}}>{infoData.name}{infoData.code}</div>
              <div style={{textAlign:'center'}}>{infoData.en}</div>
          </div>
          {showPrice(infoData.trend)}
          <div className={styles.star}>
            {showStar(currStockCode)}
          </div>
          <div className={styles.data1}>
              <div style={{color:'gray'}}>24H最高价</div>
              <div>￥{infoData.high}</div>
          </div>
          <div className={styles.data}>
              <div style={{color:'gray'}}>24H最低价</div>
              <div>￥{infoData.low}</div>
          </div>
          <div className={styles.data}>
              <div style={{color:'gray'}}>24H成交量</div>
              <div>{infoData.vol}</div>
          </div>
        </Col>
        <Col span={8}>
          <Operate/>
        </Col>
      </Row>
    </div>
  )
}
