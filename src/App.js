import React from 'react';
import {Layout} from 'antd';

import Head from './Components/Head/Head.jsx';
import Main from './Components/Main/Main.jsx';
import Policy from './Components/Policy/Policy.jsx';

import styles from './App.module.css';


const {Header, Footer, Sider, Content } = Layout;

const App = () => {

  
  
  return(
  <div className="App">
      <Layout>
      <Header className={styles.head}>
        <Head></Head>
      </Header>
      <Layout>
        <Sider className={styles.star} width={"20%"}>Star
        </Sider>
        <Content className={styles.main}>
          <Main></Main>
        </Content>
      </Layout>
      <Content className={styles.policy}>
        <Policy></Policy>
      </Content>
      <Footer className={styles.info}>Info</Footer>
    </Layout>
  </div>
)};

export default App;
