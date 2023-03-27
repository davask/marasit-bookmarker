// import React from 'react';
// import ReactDOM from 'react-dom/client';

// import ErrorBoundary from "$Src/Utils/ErrorBoundary";

// import '$Src/Assets/Css/Index.css';
// import Background from '$Src/Controller/Background';
// import reportWebVitals from '$Src/Utils/reportWebVitals';

// let sideBarNode = document.getElementById('rhs');
// if (document.getElementById('rhs') == null) {
//     sideBarNode = document.getElementById('res');
// }
// if (sideBarNode !== null) {

//     const rootNode = document.createElement('div');
//     rootNode.id = "marasit-multitasker";
//     sideBarNode.insertBefore(rootNode, sideBarNode.firstChild);

//     const root = ReactDOM.createRoot(rootNode);

//     root.render(
//         <React.StrictMode>
//             <ErrorBoundary fallback="Error">
//                 <Background />
//             </ErrorBoundary>
//         </React.StrictMode>
//     );


//     // If you want to start measuring performance in your app, pass a function
//     // to log results (for example: reportWebVitals(console.log))
//     // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//     // reportWebVitals(console.log);
// }
console.log('background: hi !');
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/assets/js/service-worker.js").then((registration) => {
        console.log("ServiceWorker registration successful with scope: ", registration.scope);
      }, (err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
    });
  }
  