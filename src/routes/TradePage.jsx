import React from 'react';
import { useParams } from 'react-router-dom';

export default function TradePage() {
    const param = useParams();
    return (
        <div>TradePage {param.TradeId}</div>
    );
}
