import React from 'react'
import { Divider, Col, Row} from 'antd';
import {FireTwoTone} from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import {change} from '../../../../AppSlice';
import styles from './SearchInfo.module.css';


export default function SearchInfo(props) {
    const dispatch = useDispatch();
    const {searchOption} = props;

    const showInfo = ()=>{
        if(searchOption === [] || searchOption === null){
            return;
        }

        if(searchOption.type === 'suggest'){
            return (
                <div>
                <div className={styles.result}>暂无相关股票</div>
                <div style={{marginBttom:'0px'}}>
                <Divider style={{color:'#2483ff',fontSize:'.8rem', marginBottom:'.2rem', marginTop:'.2rem'}}
                orientation="left" orientationMargin={30}
                >精选标的股</Divider>
                </div>
                <Row gutter={[0, 0]}>
                {
                    searchOption.option.map((item)=>{
                        return (
                            <Col span={12} key={`suggest-stock-${item.code}`}>
                            <FireTwoTone style={{fontSize:'1.3rem', marginLeft:'.1rem', float:'left', marginTop:'.8rem'}}/>
                            <div className={styles.suggestItem} onClick={()=>{console.log(item.code);dispatch(change(item.code));}}>
                                <div className={styles.suggestItemUp}><span className={styles.associationText}>{item.code} {item.name}</span></div>
                                <div className={styles.suggestItemDown}><span className={styles.associationText}>{item.en}</span></div>
                            </div>
                            </Col>
                        );
                    })
                }
                </Row>
                </div>
            );
        }

        if(searchOption.type === 'association'){
            return (
                <Row gutter={[0, 0]}>
                {
                    searchOption.option.map((item)=>{
                        return (
                            <Col span={24} key={`association-stock-${item.code}`}>
                            <div className={styles.associationItem} onClick={()=>{console.log(item.code);dispatch(change(item.code));}}>
                                <span className={styles.associationText}>{item.code} {item.name} {item.en}</span>
                            </div>
                            </Col>
                        );
                    })
                }
                </Row>
            );
        }
    }


    return (
        <div className='headSearchMain'>
            {showInfo()}
            <Divider/>
        </div>
    );
}
