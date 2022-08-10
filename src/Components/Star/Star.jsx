import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Menu, Input, Popconfirm} from 'antd';
import {FolderOutlined, StarFilled, DeleteFilled} from '@ant-design/icons';
import { useDispatch,useSelector} from 'react-redux';
import { change } from '../../AppSlice';
import { init, selectCurrStar, addFolder, removeFolder, removeStar} from './StarSlice';


import StarItem from './StarItem/StarItem';
import { postRequest } from '../../Tools/netRequest';
import { errorInfo, warningInfo } from '../../Tools/Message';

import styles from './Star.module.css'

const {Search} = Input;

export default function Star() {

    const [loginState, setLoginState] = useState(false);
    const [addState, setAddState] = useState(false);
    const [openKeys, setOpenKeys] = useState(['item-all']);


    const starData = useSelector(selectCurrStar);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //选中股票
    const onOpenChange = (keys)=>{
        setOpenKeys(keys);
    };

    //选中文件夹
    const onSelect = (item)=>{
        const stockId = item.key.split('-').slice(-1)[0];
        // console.log(stockId);
        dispatch(change(stockId));
    };

    //新建收藏夹
    const handleAddFolder = (value)=>{
        if(value === ''){
            return warningInfo('文件夹名不能为空');
        }
        const index = starData.folders.findIndex((item)=>{
            return item.name === value;
        });
        if(index>=0){
            errorInfo('存在同名文件夹')
        }
        else{
            postRequest('createfolder', {name:value})
            .then((data)=>{
                const {success, msg} = data;
                if(success === true){
                    dispatch(addFolder(value));
                }
                else{
                    errorInfo(`新建失败: ${msg}`);
                }
            })
            .catch(()=>{
                errorInfo('网络故障，请检查连接');
            });
        }
    }

    //删除收藏夹
    const handleRemoveFolder = (name)=>{
        const index = starData.folders.findIndex((item)=>{
            return item.name === name;
        });
        if(index>=0){
            postRequest('removefolder', {name:name})
            .then((data)=>{
                const {success, msg} = data;
                if(success === true){
                    dispatch(removeFolder(index));
                }
                else{
                    errorInfo(`删除失败: ${msg}`);
                }
            })
            .catch(()=>{
                errorInfo('网络故障，请检查连接');
            });
        }
        else{
            errorInfo('未知错误');
        }
    }

    //从收藏夹中移除股票
    const handleRemoveStar = (folder, code)=>{
        const folderIndex = starData.folders.findIndex((item)=>{
            return item.name === folder;
        });
        if(folderIndex<0){
            return errorInfo('未知收藏夹');
        }
        const codeIndex = starData.folders[folderIndex].children.findIndex((item)=>{
            return item === code;
        });
        if(codeIndex<0){
            return errorInfo('未知股票');
        }

        postRequest('removestar', {folder:folder,code:code})
        .then((data)=>{
            const {success, msg} = data;
            if(success === true){
                dispatch(removeStar({folderIndex:folderIndex,codeIndex:codeIndex}));
            }
            else{
                errorInfo(`移除失败: ${msg}`);
            }
        })
        .catch((err)=>{
            console.log(err);
            errorInfo('网络故障，请检查连接');
        });
    }

    //后端orSlice数据 -> Menu items参数
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
            }
        });
        tempData.push(currTotal);

        // 各子收藏夹 分为两部分写 是为了确保全部股票在数组第一个
        data.folders.map((item,index)=>{
            currTotal = {
                label:
                <div>
                    {item.name}
                    <Popconfirm
                    title={`确认删除收藏夹: ${item.name} ?`}
                    onConfirm={()=>{handleRemoveFolder(item.name)}}
                    okText="确认"
                    cancelText="取消"
                    >
                    <DeleteFilled 
                     className={styles.removeFolder}
                    />
                    </Popconfirm>
                </div>,
                key:'item-'+index,
                icon:<FolderOutlined/>,
                children:[],
            }
            currTotal.children = item.children.map((code)=>{
                return {
                    label: <StarItem code={code}/>,
                    key: currTotal.key+'-'+code,
                    icon: 
                    <Popconfirm
                    title={`确认将股票${code}从”${item.name}“中移除?`}
                    onConfirm={()=>{handleRemoveStar(item.name, code)}}
                    okText="确认"
                    cancelText="取消"
                    >
                    <StarFilled style={{color:'yellow'}}/>
                    </Popconfirm>
                }
            });
            tempData.push(currTotal);
        });
        return tempData;
        
    };

    //控制新建收藏夹控件显示
    const handleOpenInput = ()=>{
        if(loginState === true){
            setAddState(!addState);
        }
        else{
            errorInfo('请登录以启用股票收藏功能');
        }
    }
    //按钮控件显示
    const showAddBtn = ()=>{
        if(addState === false){
            return (<Button
                    className={styles.addBtn}
                    type="primary"
                    size='small'
                    onClick={handleOpenInput}>
                    新建收藏夹</Button>);
        }
        else{
            return (<Button
                    className={styles.cancelBtn}
                    type="primary"
                    size='small'
                    onClick={()=>setAddState(!addState)}>
                    取消</Button>);
        }
    };
    //输入框控件显示
    const showAddFolder = ()=>{
        if(addState===true){
            return (
                <Search
                placeholder='新建股票收藏夹'
                // allowClear
                enterButton
                onSearch={handleAddFolder}
                className={styles.inputBtn}
                />
            );
        }
    };

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
                <div className={styles.titleAdd}>{showAddBtn()}</div>
            </div>
            <div>
                {showAddFolder()}
            </div>
            <div className={styles.folderDiv}>
            {
                loginState===true?
                loginTemp:unloginTemp
            }
            </div>
        </div>
    )
}
