import React, {useState, useEffect, useCallback} from 'react';
import { Input, Button, Divider} from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import AuthInfo from '../AuthInfo/AuthInfo';
import {init, success, error} from '../AuthInfo/AuthInfoSlice';

import styles from './Login.module.css';




export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const dispatch = useDispatch();
  
  //路由跳转hook
  const navigate = useNavigate();

  const handleLogin = async()=>{
    // console.log(username, password);
    try{
      let res = await axios.post('http://localhost:3000/login', {
          username:username,
          password:password,
      });
      const {state,msg} = res.data;
      if(state === false){
        dispatch(error({msg:'登录', info:msg}));
      }
      else{
        dispatch(success({msg:'登录', info:'1秒后跳转至主页面'}));
        //登录成功 一秒后跳转至主页
        setTimeout(()=>{
          navigate('/');
        },1000);
      }
    }catch(err){
      console.log(err);
      dispatch(error({msg:'登录',info:'网络异常，请检查连接'}));
    }
  }

  
  useEffect(()=>{
    console.log('welcome to Login Page');
  },[]);

  const clearAuthState = useCallback(()=>{
    console.log('Login unmount');
    dispatch(init());
  },[dispatch]);

  useEffect(()=>{
    return clearAuthState;
  },[clearAuthState]);


  return (
      <div className={styles.main}>
        <div className={styles.alertDiv}>
          <AuthInfo></AuthInfo>
        </div>

        <div className={styles.loginDiv}>

          <div className={styles.loginHead}></div>

          <Divider>用户登录</Divider>

          <Input 
          className={styles.username}
          size='large'
          prefix={<UserOutlined />}
          placeholder="请输入用户名"
          value={username} //双向绑定数据
          onChange={
            (e) => {
              const {value} = e.target;
              setUsername(e.target.value)
              if(value === ''){
                setPassword('');
              }
          }}
          allowClear
          />

          <Input.Password
          className={styles.password}
          size='large'
          prefix={<KeyOutlined />}
          placeholder="请输入密码"
          value = {password} //双向绑定数据
          onChange={ (e) => setPassword(e.target.value)}
          />

          <Button
          className={styles.registerBtn}
          type='link'
          onClick={()=>{navigate('/Register')}}
          >
          注册账号</Button>

          <Button
          className={styles.findpwdBtn}
          type='link'
          >
          找回密码</Button>

          <Button 
          type='primary'
          className={styles.loginBtn}
          onClick={handleLogin}
          >
          登录</Button>

          <Divider></Divider>
        </div>
      </div>
  )
};
