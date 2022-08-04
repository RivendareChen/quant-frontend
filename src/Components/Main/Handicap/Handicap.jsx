import React from 'react'
import { nanoid } from 'nanoid';
import { Row, Col } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrStock } from '../../../AppSlice';

import HandicapItem from './HandicapItem/HandicapItem';
import { postRequest } from '../../../Tools/netRequest';
import styles from './Handicap.module.css';


export default function Handicap() {
  const [handicapData, setHandicapData] = useState({buyArray:[], saleArray:[]});
  const timer = useRef();
  const currStock = useSelector(selectCurrStock);

  const requestHandicap = ()=>{
    postRequest('handicap', {code:currStock})
      .then((data)=>{
        setHandicapData(data);
        console.log(currStock);
      })
      .catch((err)=>{
        console.log(err);
      });
  }

  
  useEffect(()=>{
    //页面挂载完成时立刻请求一次摆盘数据
    requestHandicap();
    
    //清除前一个currStock所设置的定时器
    //挂载成功是设置的那个定时器也要考虑到
    clearInterval(timer.current);

    //使用ref保存计时器句柄
    timer.current = setInterval(requestHandicap,1500);
  },[currStock]);

  useEffect(()=>{
    return ()=>{
      clearInterval(timer.current);
    };
  },[]);

  return (
    <div className={styles.main}>

        <div className={styles.label}>
        <Row className={styles.name}>
            <Col span={7} className={styles.col}>买入价</Col>
            <Col span={8} className={styles.col}>委托数量</Col>
            <Col span={9} className={styles.col}>交易时间</Col>
        </Row>
        {handicapData.buyArray.map((item)=>{
          return (<HandicapItem {...item} key={nanoid()}></HandicapItem>);
        })}</div>


        <div className={styles.label}>
          <Row className={styles.name}>
              <Col span={7} className={styles.col}>卖出价</Col>
              <Col span={8} className={styles.col}>委托数量</Col>
              <Col span={9} className={styles.col}>交易时间</Col>
          </Row>
          {handicapData.saleArray.map((item)=>{
            return (<HandicapItem {...item} key={nanoid()}></HandicapItem>);
          })}</div>
        
    </div>
  )
}
