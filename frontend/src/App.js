import React, { useState } from 'react';
import { Switch, Route } from "react-router-dom";
import forgotPassword from './_components/login/forgottenPassword';
import learningProfile from './_components/learning-profile';
import personalProfile from './_components/personalProfile';
import login from './_components/login';
import personalProfileEdit from './_components/personalInfo/edit.js';
import personalProfileAdd from './_components/personalInfo/add.js';
import Logout from "./_components/logout";
import { AuthContext } from "./context/auth";
import PrivateRoute from './_components/privateRoute';
import AddUser from "./_components/addUser";
import Reset from "./_components/reset";
import training from "./_components/training";
import trainingAdd from "./_components/training/add";
import learningProfileEdit from "./_components/learning-profile/edit";
import Welcome from "./_components/welcome";
import NotFoundPage from "./_components/NotFoundPage";

function App(props) {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));

  //imporovements: clear using date stamp? ?create date stamp obj to do this 
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem("tokens", data);

    //improvements: add js cookie instead of local storgae add expiary token 
    setAuthTokens(data);
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        {console.log("in app div")}
        <Switch>
          <Route exact path="/forgotPassword" component={forgotPassword} />
          <Route exact path="/login" component={login} />
          <Route exact path="/reset/:token/:userId" component={Reset} />
          <Route exact path="/" component={Welcome} />
          {/* private routes are only accessible if a user is logged in  */}
          <PrivateRoute exact path="/training" component={training} />
          <PrivateRoute exact path="/training-add" component={trainingAdd} />
          <PrivateRoute exact path="/learning-profile" component={learningProfile} />
          <PrivateRoute exact path="/learning-profile-edit/:trainingId" component={learningProfileEdit} />
          <PrivateRoute exact path="/personal-profile" component={personalProfile} />
          <PrivateRoute exact path="/personal-profile/edit" component={personalProfileEdit} />
          <PrivateRoute path="/logout" component={Logout} />
          <PrivateRoute path="/adduser" component={AddUser} />
          <PrivateRoute path="/personal-profile/add" component={personalProfileAdd} />
          {/* triggers 404 page if any path other than those speciifed above is entered  */}
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </AuthContext.Provider>
    </div>

  );
}

export default App;
