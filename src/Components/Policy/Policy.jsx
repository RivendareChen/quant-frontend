import React from 'react'

import { Menu, Button } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Trade from './Trade/Trade';
import Setter from './Setter/Setter';
import { postRequest } from '../../Tools/netRequest';

import styles from './Policy.module.css';

const items = [
  {label:'策略设置',key:'setter'},
  {label:'交易详情',key:'trade'},
];

export default function Policy() {

  const navigate = useNavigate();

  const [selectType, setSelectType] = useState('setter');
  const [loginState, setLoginState] = useState(false);

  const unloginTemp = (
    <div className={styles.policyInfo}>
        请先
        <Button 
        type='link' 
        className={styles.policyLogin}
        size="small"
        onClick={()=>{navigate('/Login')}}>
        登录</Button>
        ，以使用策略模块。
    </div>
  );

  const handleChangeType = (item)=>{
      setSelectType(item.key);
  }

  useEffect(()=>{
     postRequest('auth',{})
     .then((data)=>{
          setLoginState(data.state);
     })
     .catch((err)=>{
        console.log(err);
     })
  },[]);

  const showContent = ()=>{
      if(loginState === false){
        return unloginTemp;
      }
      if(selectType === 'setter'){
        return <Setter/>;
      }
      return <Trade/>;
  }



  return (
    <div>
      <Menu
          theme='dark'
          className={styles.menu}
          mode="horizontal"
          items={items}
          defaultSelectedKeys={['setter']}
          onSelect={handleChangeType}
        >
        </Menu>
        {showContent()}
    </div>
  )
}
