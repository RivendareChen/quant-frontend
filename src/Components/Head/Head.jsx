import React from "react";

import HeadSearch from './HeadSearch/HeadSearch.jsx';
import HeadAuth from './HeadAuth/HeadAuth.jsx';
import './Head.less';

const Head = ()=>{
    return (
        <>
            <HeadSearch></HeadSearch>
            <HeadAuth></HeadAuth>
        </>
    );
};

export default Head;

