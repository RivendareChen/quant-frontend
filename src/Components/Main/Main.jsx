import React from 'react'

import MainInfo from './MainInfo/MainInfo';
import MainK from './MainK/MainK';
import Handicap from './Handicap/Handicap';

import styles from './Main.module.css';

export default function Main() {
  return (
    <div className={styles.mainDiv}>
        <MainInfo></MainInfo>
        <MainK></MainK>
        <Handicap></Handicap>
    </div>
  )
}
