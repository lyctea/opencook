import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Main from '../components/Main';
import CheckAuth from '../components/CheckAuth';
import HomePageContainer from '../containers/HomePageContainer';
import LoginPageContainer from '../containers/LoginPageContainer';
import SharePageContainer from '../containers/SharePageContainer';

export default (
  <Route path='/' component={Main}>
    <IndexRoute component={HomePageContainer} />
    <Route path="/login" component={CheckAuth(LoginPageContainer, 'guest')}/>
    <Route path="/share" component={CheckAuth(SharePageContainer, 'auth')}/>
  </Route>
);

/*设置整个app的routing, 主要有HomePageContainer LoginPageContainer SharePageContainer*
(主页 登录页 分享页),使用Higer Order Components(高阶组件) 接收一个Component后在
class component中return返回的component的方式去确认使用者是否登录,若没有登录则不能进入
食谱分享,若没有登录也不会进入页面
 */