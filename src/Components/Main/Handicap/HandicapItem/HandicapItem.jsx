import React from 'react'
import { Row, Col } from 'antd';

import styles from './HandicapItem.module.css';

export default function HandicapItem(props) {
    const {price, quant, time, type} = props;
    const color = type==='buy'? '#F9293E':'#00aa3b';

  return (
    <div className={styles.main}>
        <Row>
            <Col span={7} style={{color:color}} className={styles.col}>{price}</Col>
            <Col span={8} className={styles.col}>{quant}</Col>
            <Col span={9} className={styles.col}>{time}</Col>
        </Row>
    </div>
  )
}
