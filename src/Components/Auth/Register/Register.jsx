import React, {useState, useEffect, useCallback} from 'react';
import { Input, Button, Divider} from 'antd';
import { UserOutlined, KeyOutlined, MailOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import AuthInfo from '../AuthInfo/AuthInfo';
import {init, success, error} from '../AuthInfo/AuthInfoSlice';

import styles from './Register.module.css';

const regexEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;


export default function Register() {

    const [username, setUsername] = useState('');
    const [usermail, setUsermail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [emailState, setEmailState] = useState('');
    
    
    const dispatch = useDispatch();
    
    //路由跳转hook
    const navigate = useNavigate();

    const handlePwdComfirm = ()=>{
        if(password1 !== password2){
            return 'error';
        }
        return '';
    }

    const handleRegist = async()=>{
        if(username === ''){
            return dispatch(error({msg:'注册', info:'用户名不能为空'}));
        }
        if(usermail === ''){
            return dispatch(error({msg:'注册', info:'电子邮箱不能为空'}));
        }
        if(emailState === 'error'){
            return dispatch(error({msg:'注册',info:'电子邮箱格式不正确'}));
        }
        if(password1 === ''){
            return dispatch(error({msg:'注册', info:'密码不能为空'}));
        }
        if(password1 !== password2){
            return dispatch(error({msg:'注册', info:'请确认两次密码输入一致'}));
        }
        const registerInfo = {
            username:username,
            usermail:usermail,
            password:password1,
        };
        // const {state,msg} = await axios.post('http://localhost:3000/register', registerInfo).data;
        const res = await axios.post('http://localhost:3000/register', registerInfo);
        const {state, msg} = res.data;
        if(state === true){
            dispatch(success({msg:'注册',info:'请在邮箱查收注册邮件以完成注册'}));
        }
        else{
            dispatch(error({msg:'注册',info:msg}));
        }
    }

    //useEffect 第一个参数是一个函数，
    //函数内部是当组件刷新时所要执行的代码,
    //函数的返回值也是一个函数，称作清除器。
    //清除器中的代码不一定比return之前的代码后执行（例如之前的代码是异步的）。
    //设定清除器可能是为了模拟unMount，也可能是为了“在执行当前 effect 之前对上一个 effect 进行清除”。

    //useEffect 第一个参数是一个数组，
    //仅当该数组内的state变量刷新时，才触发第一个参数内部的代码。
    //当数组为空数组时，仅当组件被挂载或卸载时才触发一个参数内的代码。

    //因此各类式组件的生命周期函数，在函数式组件中可表示为:

    //didMount
    useEffect(()=>{
        console.log('welcome to regiester page');
    },[]);

    //willUnMount
    //用useCallback解决React Hook useEffect has missing dependencies
    //详见https://blog.csdn.net/qq_26732261/article/details/112565590
    const clearAuthState = useCallback(()=>{
        console.log('Register unmount');
        dispatch(init());
    },[dispatch]);

    useEffect(()=>{
        return clearAuthState;
    },[clearAuthState]);

    //didUpdate 仅对usermail生效
    useEffect(()=>{
        const isEmail = regexEmail.test(usermail);
        if(isEmail || usermail === ''){
            setEmailState('');
        }
        else{
            setEmailState('error');
        }

    },[usermail]);

    //uesEffect支持async/await
    //但是不建议把它的第一个参数写成异步函数
    //需要先在参数函数的内部新建一个异步函数，把async/await的内容写在里面，然后再调用它。
    //这是因为：每个async函数都会默认返回一个隐式的promise。但是，useEffect不应该返回任何内容。
    //例子如下
    // const testf = ()=>{
    //     return new Promise((resolve)=>{
    //         setTimeout(()=>{
    //             console.log('prev')
    //             resolve();
    //         },1000);
    //     });
    // }
    
    // useEffect(()=>{
    //     const iner = async()=>{
    //         await testf();
    //         console.log('next');
    //     }
    //     iner();
    // });

    


    return (
        <>
            <div className={styles.alertDiv}>
            <AuthInfo></AuthInfo>
            </div>

            <div className={styles.registerDiv}>

            <div className={styles.registerHead}></div>

            <Divider>用户注册</Divider>

            <Input 
            className={styles.username}
            size='large'
            prefix={<UserOutlined />}
            placeholder="请输入用户名"
            value={username} //双向绑定数据
            onChange={(e)=>setUsername(e.target.value)}
            allowClear
            />

            <Input 
            className={styles.usermail}
            size='large'
            prefix={<MailOutlined />}
            placeholder="请输入电子邮箱"
            value={usermail} //双向绑定数据
            onChange={(e)=>setUsermail(e.target.value)}
            allowClear
            status={emailState}
            />

            <Input.Password
            className={styles.password}
            size='large'
            prefix={<KeyOutlined />}
            placeholder="请输入密码"
            value = {password1} //双向绑定数据
            onChange={ (e) => setPassword1(e.target.value)}
            status={handlePwdComfirm()}
            />

            <Input.Password
            className={styles.password}
            size='large'
            prefix={<KeyOutlined />}
            placeholder="确认密码"
            value = {password2} //双向绑定数据
            onChange={ (e) => setPassword2(e.target.value)}
            status={handlePwdComfirm()}
            />

            <Button 
            type='primary'
            className={styles.registerBtn}
            onClick={handleRegist}
            >
            注册</Button>

            <Button
            className={styles.loginBtn}
            type='link'
            onClick={()=>{navigate('/Login')}}
            >登录现有账号</Button>

            <Divider></Divider>

            </div>
        </>
    )
};