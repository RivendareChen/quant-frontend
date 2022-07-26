import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'antd';

import { selectType, selectMsg, selectInfo} from './AuthInfoSlice';
import { init } from './AuthInfoSlice';

export default function AuthInfo() {
    const type = useSelector(selectType);
    const msg = useSelector(selectMsg);
    const info = useSelector(selectInfo);
    
    const dispatch = useDispatch();
    

    let content = (<></>);
    if(type === 'success' || type === 'error'){
        content = (
            <Alert
                message={msg}
                description={info}
                type={type}
                closable
                showIcon
                onClose={()=>{dispatch(init())}}
            />
        );
    }
    return content;
}
