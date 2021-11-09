import React from 'react';
import ReactDOM from 'react-dom';
import { MoralisProvider } from 'react-moralis';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
  <MoralisProvider
    serverUrl="https://hteppc7vx3fc.usemoralis.com:2053/server"
    appId="FX1kOigiW3xBfHkxqGQI4tMWKGHPsvEfadFM1fM4"
  >
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </MoralisProvider>
  ,
  document.getElementById('root'),
);
