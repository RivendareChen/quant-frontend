import React from 'react'
import { nanoid } from 'nanoid';

import { Button } from 'antd';
import { Link } from 'react-router-dom';

export default function Trade() {
  const arr = [1,2,3,4,5];
  return (
    <div>Trade
        {
          arr.map((id)=>{
            return (
              <Button key={nanoid()}>
                <Link to={`/Trade/${id}`} key={nanoid()} target="_blank">订单{id}</Link>
              </Button>
            );
          })
        }
    </div>
  )
}
