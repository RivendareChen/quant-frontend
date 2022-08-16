import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';

import App from './App';
import RegisterPage from './routes/RegisterPage';
import LoginPage from './routes/LoginPage';
// import TradePage from './routes/TradePage';
import UserPage from './routes/UserPage';


import store from './Store/store';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}></Route>
                <Route path="/Register" element={<RegisterPage />}></Route>
                <Route path="/Login" element={<LoginPage />}></Route>
                {/* <Route path="/Trade" element={<TradePage/>}>
                    <Route path=":TradeId" element={<TradePage/>}></Route>
                </Route> */}
                <Route path='User' element={<UserPage/>}>
                    <Route path=":username" element={<UserPage/>}></Route>
                </Route>
                <Route path="*" element={<div>404</div>}></Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
