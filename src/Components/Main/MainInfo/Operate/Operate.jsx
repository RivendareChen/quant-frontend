import React from 'react'
import { Button, Select } from 'antd'
import { useState } from 'react';
import {DownloadOutlined} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrStock } from '../../../../AppSlice';
import { selectCurrStar } from '../../../Star/StarSlice';
import FileSaver from 'file-saver'
import { nanoid } from 'nanoid';

import { postRequest } from '../../../../Tools/netRequest';
import { addStar } from '../../../Star/StarSlice';
import { errorInfo , warningInfo} from '../../../../Tools/Message';

import styles from './Operate.module.css'

const { Option } = Select;

export default function Operate() {

    const dispatch = useDispatch();

    const currStockCode = useSelector(selectCurrStock);
    const currStar = useSelector(selectCurrStar);
    const [currFolder, setCurrFolder] = useState(null);

    const handleDownload = ()=>{
        postRequest('download', {code:currStockCode})
        .then((res)=>{
        const {state, msg, data} = res;
        if(state === true){
            const blob = new Blob([JSON.stringify(data)],{type:"text/plain;charset=utf-8"});
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
            const day = (date.getDate()<10 ? '0'+date.getDate() : date.getDate());
            const fileName = `data-${currStockCode}-${year}-${month}-${day}.json`
            FileSaver.saveAs(blob,fileName);
        }
        else{
            errorInfo(msg);
        }
        })
        .catch((err)=>{
            console.log(err);
            errorInfo('请检查网络连接');
        });
    };

    const handleSelect = ()=>{
        // alert(currFolder+' '+currStockCode);
        const codeIndex = currStar.total.children.findIndex((code)=>{
            return code === currStockCode;
        });
        if(codeIndex<0){
            return warningInfo('请先收藏该股票');
        }

        const folderIndex = currStar.folders.findIndex((folder)=>{
            return folder.name === currFolder;
        });
        if(folderIndex<0){
            return errorInfo('不存在该自定收藏夹');
        }

        const folder = currStar.folders[folderIndex].children;
        const ifExsit = folder.findIndex((code)=>{
            return code === currStockCode;
        })
        if(ifExsit>=0){
            return warningInfo(`股票${currStockCode}已经存在于收藏夹中`)
        }

        postRequest('addstar', {folder:currFolder,code:currStockCode})
        .then((data)=>{
            const {success, msg} = data;
            if(success === true){
                dispatch(addStar({folderIndex:folderIndex,codeIndex:codeIndex}));
            }
            else{
                errorInfo(`添加失败: ${msg}`);
            }
        })
        .catch((err)=>{
            console.log(err);
            errorInfo('网络故障，请检查连接');
        });
        setCurrFolder(null);
    };

    const showFolders = ()=>{
        return currStar.folders.map((folder)=>{
            return <Option value={folder.name} key={nanoid()}>{folder.name}</Option>
        });
    }
    
    return (
    <div>
        <div className="subSatrDiv">
        <Select
        className={styles.select}
        showSearch
        placeholder="选择自定收藏夹"
        optionFilterProp="children"
        value={currFolder}
        onChange={(value)=>{setCurrFolder(value)}}
        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
        >
        {showFolders()}
        </Select>
        <Button
        className={styles.selectBtn}
        type='primary'
        onClick={handleSelect}
        >加入
        </Button>
        </div>

        <Button 
        type='primary' 
        shape='round' 
        icon={<DownloadOutlined/>}
        className={styles.download}
        onClick={handleDownload}
        >
        盘后数据
        </Button>
    </div>
    )
}
