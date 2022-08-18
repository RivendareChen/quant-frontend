import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';

import App from './App';
import RegisterPage from './routes/RegisterPage';
import LoginPage from './routes/LoginPage';
import UserPage from './routes/UserPage';
import PolicyPage from './routes/PolicyPage';

import store from './Store/store';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider locale={zhCN}>
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}></Route>
                <Route path="/Register" element={<RegisterPage />}></Route>
                <Route path="/Login" element={<LoginPage />}></Route>
                <Route path="/Policy" element={<PolicyPage/>}>
                    <Route path=":PolicyId" element={<PolicyPage/>}></Route>
                </Route>
                <Route path='/User' element={<UserPage/>}>
                    <Route path=":username" element={<UserPage/>}></Route>
                </Route>
                <Route path="*" element={<div>404</div>}></Route>
            </Routes>
        </BrowserRouter>
    </Provider>
    </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
