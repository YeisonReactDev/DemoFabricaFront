import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import "antd/dist/antd.css";
import "antd/dist/reset.css";
import './index.css'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
