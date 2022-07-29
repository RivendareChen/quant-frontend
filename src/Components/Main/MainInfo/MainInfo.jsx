import React from 'react'
import { Col, Row , Button} from 'antd';
import {DownloadOutlined, StarOutlined} from '@ant-design/icons';

import styles from './MainInfo.module.css';


export default function MainInfo() {
  return (
    <div className={styles.mainInfoDiv}>
      <Row>
        <Col span={20}>
          <div className={styles.name}>
              <div style={{fontSize:'25px'}}>长和00001</div>
              <div style={{textAlign:'center'}}>CKH HOLDINGS</div>
          </div>
          <div className={styles.name}>
              <div style={{fontSize:'25px'}}>￥48.69</div>
              <div style={{textAlign:'center'}}>+100%</div>
          </div>
          <div className={styles.star}>
            <StarOutlined style={{fontSize:'35px'}} />
          </div>
          <div className={styles.data1}>
              <div>24H最高价</div>
              <div>￥50.01</div>
          </div>
          <div className={styles.data}>
              <div>24H最低价</div>
              <div>￥48.55</div>
          </div>
          <div className={styles.data}>
              <div>24H成交量</div>
              <div>2456</div>
          </div>
        </Col>
        <Col span={4}>
          <Button 
          type='primary' 
          shape='round' 
          icon={<DownloadOutlined/>}
          className={styles.download}
          >
          盘后数据</Button>
        </Col>
      </Row>
    </div>
  )
}
