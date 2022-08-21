import React from 'react'
import { useEffect, useState} from 'react'

import { postRequest } from '../../../Tools/netRequest';

import styles from './StarItem.module.css'



export default function StarItem(props) {   

    const {code} = props;

    const [currData, setCurrData] = useState({});

    const showInfo = ()=>{
        
        if(currData.trend>0){
            return (
                <div className={styles.info} style={{color:'#F9293E'}}>
                    {currData.name}{currData.code}
                </div>
            );
        }
        return (
            <div className={styles.info} style={{color:'#00AA3B'}}>
                    {currData.name}{currData.code}
            </div>
        );
    }
    
    useEffect(()=>{
        postRequest('info',{code:code})
        .then((data)=>{
            console.log(code,data.trend);
            setCurrData(data);
        })  
        .catch((err)=>{
            console.log(err);
        })
    },[]);
    

    return (
        <div>
            {showInfo()}
        </div>
    )
}
