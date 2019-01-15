require('dotenv').config({path:'./.env'});
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './App';
import { Store } from "./redux/Store";

const store = Store();


ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('app'));