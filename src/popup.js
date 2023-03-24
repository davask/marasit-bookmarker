import React from 'react';
import ReactDOM from 'react-dom';

import ErrorBoundary from "$Src/Utils/ErrorBoundary";

import '$Src/Assets/Css/Index.css';
import Popup from '$Src/Controller/Popup';
import reportWebVitals from '$Src/Utils/reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary fallback="Error">
            <Popup />
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
