import React, {useState} from 'react';
import { Input, Button, Divider, Alert } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import styles from './Login.module.css';




export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [loginState, setloginState] = useState(true);
  
  //路由跳转hook
  const navigate = useNavigate();

  const showAlert = (good)=>{
    console.log(good);
    if(!good){
      return (
        <Alert
          message="登录失败"
          description="用户名或密码错误！"
          type="error"
          closable
          showIcon
          onClose={()=>{setloginState(true)}}
        />
      );
    }
  };

  const handleLogin = async()=>{
    console.log(username, password);
    let res = await axios.post('http://localhost:3000/login', {
        username:username,
        password:password,
    });
    const {state} = res.data;
    if(state === false){
      setloginState(false);
    }
    else{
      navigate('/');
    }
  }


  return (
      <>
        <div className={styles.alertDiv}>
          {showAlert(loginState)}
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
      </>
  )
};
