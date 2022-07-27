import React from 'react'

import styles from './User.module.css';

export default function User(props) {
  return (
    <div className={styles.mainDiv}>
      User: {props.username}
    </div>
  )
}
