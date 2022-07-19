import React from 'react';
import { Layout , Input} from 'antd';

import './App.less';

const { Header, Footer, Sider, Content } = Layout;
const { Search } =  Input;

const App = () => (
  <div className="App">
      <Layout>
      <Header className="head">
        <Search className="search"></Search>
      </Header>
      <Layout>
        <Sider className="star" width={"15%"}>Star</Sider>
        <Content className="main">Main</Content>
      </Layout>
      <Content className="policy">Policy</Content>
      <Footer className="info">Info</Footer>
    </Layout>
  </div>
);

export default App;
