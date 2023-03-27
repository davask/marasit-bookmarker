// import React from 'react';
// import ReactDOM from 'react-dom/client';

// import ErrorBoundary from "$Src/Utils/ErrorBoundary";

// import '$Src/Assets/Css/Index.css';
// import Popup from '$Src/Controller/Popup';
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
//                 <Popup />
//             </ErrorBoundary>
//         </React.StrictMode>
//     );


//     // If you want to start measuring performance in your app, pass a function
//     // to log results (for example: reportWebVitals(console.log))
//     // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//     // reportWebVitals(console.log);
// }

document.getElementById("grantPermission").addEventListener("click", function() {
    chrome.permissions.request({permissions: ["private"]}, function(granted) {
      if (granted) {
        alert("Private browsing permission granted!");
      } else {
        alert("Private browsing permission denied!");
      }
    });
  });
  