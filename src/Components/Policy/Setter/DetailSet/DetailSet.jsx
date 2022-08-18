import React from 'react'

import styles from './DetailSet.module.css';

export default function DetailSet(props) {
    const {policyId} = props;
    return (
        <div className={styles.main}>PolicyId: {policyId}</div>
    );
}
