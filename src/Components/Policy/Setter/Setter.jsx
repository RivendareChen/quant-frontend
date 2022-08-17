import React from 'react'


import ItemSet from './ItemSet/ItemSet';
import ToTalSet from './TotalSet/ToTalSet';
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
        3
      </div>
    </div>
  )
}
