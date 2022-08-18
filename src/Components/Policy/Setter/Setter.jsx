import React from 'react'


import ItemSet from './ItemSet/ItemSet';
import ToTalSet from './TotalSet/ToTalSet';
import ShowSet from './ShowSet/ShowSet';
import styles from './Setter.module.css';


export default function Setter() {
  return (
    <div>
      <div className={styles.itemDiv}>
        <ItemSet/>
      </div>
      <div className={styles.totalDiv}>
        <ToTalSet/>
      </div>
      <div className={styles.showDiv}>
        <ShowSet/>
      </div>
    </div>
  )
}
