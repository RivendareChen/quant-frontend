import React from 'react';
import { useParams } from 'react-router-dom';


import DetailSet from '../Components/Policy/Setter/DetailSet/DetailSet';

export default function PolicyPage() {
    const param = useParams();
    return (
        <div>
            <DetailSet policyId={param.PolicyId}/>
        </div>
    );
}