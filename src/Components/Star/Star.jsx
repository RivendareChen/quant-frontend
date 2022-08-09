import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Menu} from 'antd';
import {FolderOutlined, StarFilled} from '@ant-design/icons';
import { useDispatch,useSelector} from 'react-redux';
import { change } from '../../AppSlice';
import { init, selectCurrStar} from './StarSlice';


import StarItem from './StarItem/StarItem';
import { postRequest } from '../../Tools/netRequest';

import styles from './Star.module.css'



export default function Star() {

    const [loginState, setLoginState] = useState(false);
    const [openKeys, setOpenKeys] = useState(['item-all']);

    const starData = useSelector(selectCurrStar);

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

    const handleItem = (data)=>{
        const tempData = [];

        //所有股票
        let currTotal = {
            label:data.total.name,
            key:'item-all',
            children:[],
        };
        currTotal.children = data.total.children.map((code)=>{
            return {
                label: <StarItem code={code}/>,
                key: currTotal.key+'-'+code,
                icon: <StarFilled style={{color:'yellow'}}/>
            }
        });
        tempData.push(currTotal);

        // 各子收藏夹 分为两部分写 是为了确保全部股票在数组第一个
        data.folders.map((item,index)=>{
            currTotal = {
                label:item.name,
                key:'item-'+index,
                icon:<FolderOutlined/>,
                children:[],
            }
            currTotal.children = item.children.map((code)=>{
                return {
                    label: <StarItem code={code}/>,
                    key: currTotal.key+'-'+code,
                    icon: <StarFilled style={{color:'yellow'}}/>
                }
            });
            tempData.push(currTotal);
        });
        return tempData;
        
    }

    const loginTemp = (
        <div>
            <Menu
            mode='inline'
            inlineIndent={3}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onSelect={onSelect}
            theme='dark'
            className={styles.folder}
            items={handleItem(starData)}
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

    useEffect(()=>{
        postRequest('initstar',{})
        .then((data)=>{
            dispatch(init(data));
        })
        .catch((err)=>{
            console.log(err);
        })
    },[]);


    return (
        <div className={styles.main}>
            <div className={styles.title}>
                <div className={styles.titleFont}>股票收藏</div>
            </div>
            <div>
            {
                loginState===true?
                loginTemp:unloginTemp
            }
            </div>
        </div>
    )
}
