import React, { useEffect } from 'react';
import { Route, Switch, BrowserRouter as Router, useHistory } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import ChatPage from "./pages/ChatPage"
import ForgotPass from "./pages/ForgotPass"
import SignUpPage from "./pages/SignUpPage";
import LogOutPage from "./pages/LogOutPage"
import { setUserDetails } from "./redux/actions/index"
import { useDispatch } from 'react-redux'
import Review from './pages/Review';

export default function App() {

  const history = useHistory();
  const dispatch = useDispatch()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    dispatch(setUserDetails(user));
    // console.log(user);


  }, [])


  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={ChatPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/change-password" component={ForgotPass} />
          <Route path="/loged-out" component={LogOutPage} />
          <Route path="/review-page" component={Review} />
        </Switch>
      </Router>
    </>
  );
}