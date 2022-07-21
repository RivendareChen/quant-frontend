import React from "react";

import HeadSearch from './HeadSearch/HeadSearch.jsx';
import HeadButton from "./HeadButton/HeadButton.jsx";
import './Head.less';

const Head = ()=>{
    return (
        <>
            <HeadSearch></HeadSearch>
            <HeadButton></HeadButton>
        </>
    );
};

export default Head;

