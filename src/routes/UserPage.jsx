import React from 'react'
import { useParams } from 'react-router-dom';

import User from '../Components/Auth/User/User.jsx';

export default function UserPage() {
  const params = useParams();
  return (
    <div>
        <User {...params}/>
    </div>
  )
}
