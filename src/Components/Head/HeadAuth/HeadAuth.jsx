import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {Button, Space} from 'antd';

import { postRequest } from '../../../Tools/netRequest';

import styles from './HeadAuth.module.css';


export default function HeadButton() {

  const [loginState, setLoginState] = useState(false);
  const [username, setUsername] = useState('');

  //注销账户
  const handleUnRegister = async()=>{
    await postRequest('unregister', {});
    window.location.reload();
  };
  
  //在组件挂载阶段验证登录信息
  useEffect(()=>{
    postRequest('auth', {})
    .then((data)=>{
      const {state, username} = data;
      setLoginState(state);
      setUsername(username);
    })
    .catch((err)=>{
      console.log(err);
    });
  },[]);

  //未登录状态模板
  const beforeLoginTemp = (
    <Space size={'middle'}>
            <Button className={styles.registerBtn}type="link">
                <Link to="/Register">注册</Link>
            </Button>
            <Button className={styles.loginBtn} type="primary">
                <Link to="/Login">登录</Link>
            </Button>
    </Space>   
  );
  
  //已登录状态模板
  const afterLoginTemp = (
    <Space size={'middle'}>
      <Button className={styles.infoBtn} type="link">
        <Link to={`/User/${username}`}>hello, {username}</Link>
      </Button>
      <Button className={styles.unregisterBtn} onClick={handleUnRegister} type="primary">
          注销
      </Button>
    </Space>
  );

  return (
      <div className={styles.authDiv}>
        {loginState === true? afterLoginTemp: beforeLoginTemp}
      </div>
  );
}
