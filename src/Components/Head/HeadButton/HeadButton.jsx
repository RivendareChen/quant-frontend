import React from 'react'
import {Button, Space} from 'antd';

import './HeadButton.less';

export default function HeadButton() {
  return (
    <Space className="head-button" size={'middle'}>
        <Button className="head-signin" type="link">注册</Button>
        <Button className="head-login" type="primary">登录</Button>
    </Space>
  );
}
