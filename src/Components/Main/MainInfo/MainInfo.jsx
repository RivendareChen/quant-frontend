import React from 'react'
import { useEffect, useState} from 'react';
import {StarOutlined, StarFilled} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrStock } from '../../../AppSlice';
import { selectCurrStar, star } from '../../Star/StarSlice';
import {Badge} from 'antd';

import { postRequest } from '../../../Tools/netRequest';
import { errorInfo, successInfo } from '../../../Tools/Message';
import Operate from './Operate/Operate';
import styles from './MainInfo.module.css';

const marketStateArray = [
  '无交易', //0
  '竞价',   //1
  '早盘前等待开盘', //2
  '早盘',//3
  '午间休市',//4
  '午盘',//5
  '收盘',//6
  '未知状态',//7
  '盘前',//8
  '盘前结束',//9
  '盘后',//10
  '盘后结束',//11
  '未知状态',//12
  '夜市开盘',//13
  '夜市收盘',//14
  '期指日市开盘',//15
  '期指日市休市',//16
  '期指日市收盘',//17
  '期指日市等待开盘',//18
  '盘后竞价',//19
];


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

  const showMarketState = (marketCode)=>{
      let badgeState = 'warning';
      let marketText = '未知状态';
      if(marketCode === 3 || marketCode===5 || marketCode===13 || marketCode===15){
        badgeState = 'processing';
      }
      if(marketCode>=0 && marketCode<=19){
        marketText=marketStateArray[marketCode];
      }
      return (
        <Badge 
         status={badgeState} 
         text={<span className={styles.badgeText}>{marketText}</span>}
        />
      );
  }


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
          <div className={styles.data}>
              <div style={{color:'gray'}}>市场状态·HK</div>
              <div>{showMarketState(infoData.marketState)}</div>
          </div>
        
          <Operate/>
        
    </div>
  )
}
