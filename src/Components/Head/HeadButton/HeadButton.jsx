import React from 'react';
import { Link } from 'react-router-dom';
import {Button, Space} from 'antd';

import './HeadButton.less';

export default function HeadButton() {
  return (
    <Space className="head-button" size={'middle'}>
        <Button className="head-signin" type="link">
            <Link to="/Register">注册</Link>
        </Button>
        <Button className="head-login" type="primary">
            <Link to="/Login">登录</Link>
        </Button>
    </Space>
  );
}
