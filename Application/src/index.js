require('dotenv').config({path:'./.env'});
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './App';
import Store from "./redux/Store";


ReactDOM.render(<Provider store={Store}><App/></Provider>, document.getElementById('app'));

export default Store;