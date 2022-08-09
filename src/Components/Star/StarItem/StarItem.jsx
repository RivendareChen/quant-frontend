import React from 'react'
import { useEffect, useState} from 'react'
import { Typography } from 'antd';

import { postRequest } from '../../../Tools/netRequest';

import styles from './StarItem.module.css'

const {Text} = Typography;

export default function StarItem(props) {   

    const {code} = props;

    const [currData, setCurrData] = useState({});

    const showTrend = ()=>{
        if(currData.trend>0){
            return (
                <div className={styles.trend} style={{color:'#F9293E'}}>
                    +{currData.trend}%
                </div>
            );
        }
        return (
            <div className={styles.trend} style={{color:'#00aa3b'}}>
                    {currData.trend}%
            </div>
        );
    }
    
    useEffect(()=>{
        postRequest('info',{code:code})
        .then((data)=>{
            setCurrData(data);
        })  
        .catch((err)=>{
            console.log(err);
        })
    },[]);
    

    return (
        <div>
            <div className={styles.info}>
                <div className={styles.name} >{currData.name}</div>
                <div className={styles.code} >{currData.code}</div>
                {/* <Text
                style={{ width: '20px', fontSize:'8px', color:'whitesmoke',backgroundColor:'red'}}
                ellipsis={{ tooltip: currData.code+currData.name } }
                >
                {currData.code}{currData.name}
                </Text> */}
            </div>
            {showTrend()}
        </div>
    )
}
