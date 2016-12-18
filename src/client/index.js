import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import { fromJS } from 'immutable';
//在routing放置common文件夹中的routes
import routes from '../common/routes';
import configureStore from '../common/store/configureStore';
import { checkAuth } from '../common/actions';

//将server side 传过来的initiaState给rehydration
const initialState = window.__PRELOADED_STATE__;
//讲initialState传给configureStore函数,创建store并传给Provider
const  store = configureStore(fromJS(initialState));
ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes}/>
    </Provider>,document.getElementById('app')
);