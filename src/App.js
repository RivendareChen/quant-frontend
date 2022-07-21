import React from 'react';
import {Layout, Button} from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import {init, selectApp} from './AppSlice.js';

import Head from './Components/Head/Head.jsx';
import './App.less';


const {Header, Footer, Sider, Content } = Layout;

const App = () => {
  const currStockCode = useSelector(selectApp);
  const dispatch = useDispatch();
  
  return(
  <div className="App">
      <Layout>
      <Header className='head'>
        <Head></Head>
      </Header>
      <Layout>
        <Sider className="star" width={"20%"}>Star
        </Sider>
        <Content className="main">
          {currStockCode}
          <Button onClick={()=>dispatch(init())}>init</Button>
        </Content>
      </Layout>
      <Content className="policy">Policy</Content>
      <Footer className="info">Info</Footer>
    </Layout>
  </div>
)};

export default App;
