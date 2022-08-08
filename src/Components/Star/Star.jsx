import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Menu} from 'antd';
import {FolderOutlined ,StarOutlined} from '@ant-design/icons';
import { nanoid } from 'nanoid';
import { useDispatch } from 'react-redux';
import { change } from '../../AppSlice';

import { postRequest } from '../../Tools/netRequest';

import styles from './Star.module.css'

const testItem = [
    {
        label:'全部股票', 
        key:'item-all',
        children:[
            {label:'00001长和',key:nanoid()+'-00001',icon: <StarOutlined/>},
            {label:'00002中电控股',key:nanoid()+'-00002',icon: <StarOutlined/>},
            {label:'00003香港中华煤气',key:nanoid()+'-00003',icon: <StarOutlined/>}
        ]
    },
    {
        label:'自定股票集合1',
        key:'item-1',
        icon: <FolderOutlined />,
        children:[
            {label:'00001长和',key:nanoid()+'-00001',icon: <StarOutlined/>},
        ]
    },
    {
        label:'自定股票集合2',
        key:'item-2',
        icon: <FolderOutlined />,
        children:[
            {label:'00002中电控股',key:nanoid()+'-00002',icon: <StarOutlined/>},
            {label:'00003香港中华煤气',key:nanoid()+'-00003',icon: <StarOutlined/>}
        ]
    }
]

export default function Star() {

    const [loginState, setLoginState] = useState(false);
    const [openKeys, setOpenKeys] = useState(['item-all']);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onOpenChange = (keys)=>{
        setOpenKeys(keys);
    }

    const onSelect = (item)=>{
        const stockId = item.key.split('-').slice(-1)[0];
        // console.log(stockId);
        dispatch(change(stockId));
    }

    const loginTemp = (
        <div>
            <Menu
            mode='inline'
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onSelect={onSelect}
            theme='dark'
            items={testItem}
            />
        </div>
    );
    
    const unloginTemp = (
        <div className={styles.starInfo}>
            请先
            <Button 
            type='link' 
            className={styles.starLogin}
            size="small"
            onClick={()=>{navigate('/Login')}}>
            登录</Button>
            ，以使用股票收藏功能。
        </div>
    );

    useEffect(()=>{
        postRequest('auth', {})
        .then((data)=>{
            setLoginState(data.state);
        })
        .catch((err)=>{
            console.log(err);
        });
    },[]);


    return (
        <>
            <div className={styles.title}>
                <div className={styles.titleFont}>股票收藏</div>
            </div>
            <div>
            {
                loginState===true?
                loginTemp:unloginTemp
            }
            </div>
        </>
    )
}
