//引入Express, mongoose(MongoDB)以及相关server上使用的组件
/*Server Packages*/
import Express from 'express';
import bodyParser from 'body-parser';
import coolieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config';
//引入后端model通过model和数据库互动
import User from './models/user';
import Recipe from './models/recipe';

//引入webpackDevMiddleware当做前端server middleware
/*Client Packages*/
import webpack from 'webpack';
import React from 'react';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { RouterContext, match } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import Immutable, { fromJS } from 'immutable';
/*Common Packages*/
import webpackConfig from '../../webpack.config';
import routes from '../common/routes';
import configureStore from '../common/store/configureStore';
import fetchComponentData from '../common/utils/fetchComponentData';
import apiRoutes from './controllers/api.js';
/*config*/
//初始化Express server
const app = new Express();
const port = process.env.PORT || 3000;
//链接到数据库, 相关配置文件放在config.database
mongoose.connect(config.database);
app.set('env','production');
//设定静态文件位置
app.use('./static', Express.state(__dirname + '/public'));
app.use(cookieParser());
//use body parser so we can get info from POST add/or URL parmeter
app.use(bodyParser.urllencoded({extend: false})); //only can deal with key/value
app.use(bodyParser.json());
//use morgan to log requests to the console
app.use(morgan('dev'));

//负责每次接受到request的处理函数, 判断如何处理和去的initiaState整理后结合
//服务器渲染页面传给前端
const handleRender = (req, res) => {
    //Query our mock API asnchronously
    match({ routes, location: req.url },(error, redirectLocation, renderProps) => {
        if(error){
            res.status(500).send(error.message);
        }else if(redirectLocation){
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }else if(renderProps == null){
            res.status(404).send('Not Found');
        }
        fetchComponentData(req.cookies.token).then((response) => {
            let isAuthorized = false;
            if(response[1].data.success === true ){
                isAuthorized = true;
            }else{
                isAuthorized = false;
            }
            const  initialState = fromJS({
                recipe : {
                    recipis: response[0].data,
                    recipi: {
                        id: '',
                        name: '',
                        description: '',
                        imagePath: ''
                    }
                },
                user: {
                    isAuthorized: isAuthorized,
                    isEdit: false
                }
            });
            //server side渲染页面
            //create a new redux store instance
            const store = configureStore(initialState);
            const initView = renderToString(
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            );
            let state = store.getState();
            let page = renderFullPage(initView, state);
            return res.status(200).send(page);
        })
            .catch(err => res.send(message));
    })
}
//基础页面HTML设计
const renderFullPage = (html, preloadedState) => (`
    <!doctype html>
<html>
<head>
    <title>OpenCook 分享料理的美好時光</title>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
    <!-- Optional theme -->
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/journal/bootstrap.min.css">
<body>
<div id="app">${html}</div>
<script>
    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
</script>
<script src="/static/bundle.js"></script>
</body>
</html>`
);
//设定hot reload middleware
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler,{ noInfo: true,publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

//设计API prefix, 并使用controller中的apiRoutes进行处理
app.use('/api', apiRoutes);
//使用服务器端的handleRender
app.use(handleRender);
app.listen(port, (error) => {
    if(error){
        console.log(error);
    }else{
        console.log(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
    }
});