import { message } from "antd";

export const warningInfo = (msg)=>{
    message.warning({content:msg,style:{marginTop:'220px',},duration:1});
};

export const errorInfo = (msg)=>{
    message.error({content:msg,style:{marginTop:'220px',},duration:1});
};

export const successInfo = (msg)=>{
    message.success({content:msg,style:{marginTop:'220px',},duration:1});
};