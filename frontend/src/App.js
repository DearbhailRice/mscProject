import React, { useState } from 'react';
import { Switch, Route } from "react-router-dom";
import forgotPassword from './_components/login/forgottenPassword';
import learningProfile from './_components/learning-profile';
import personalProfile from './_components/personalProfile';
import login from './_components/login';
import personalProfileEdit from './_components/personalInfo/edit.js';
import addUser from "./_components/addUser";
import Logout from "./_components/logout";
import { AuthContext } from "./context/auth";
import PrivateRoute from './_components/privateRoute';
import AddUser from "./_components/addUser"
import Reset from "./_components/reset"

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
          {console.log("in switch")}
          {/* <PrivateRoute excat path="/add-user" componet={addUser} /> */}
          <Route exact path="/forgotPassword" component={forgotPassword} />
          <Route exact path="/login" component={login} />
          <Route exact path="/reset/:token/:userId" component={Reset} />
          <PrivateRoute exact path="/learning-profile" component={learningProfile} />
          <PrivateRoute exact path="/personal-profile" component={personalProfile} />
          <PrivateRoute exact path="/personalProfile/edit" component={personalProfileEdit} />
          <PrivateRoute path="/logout" component={Logout} />
          <PrivateRoute path="/adduser" component={AddUser} />
        </Switch>
      </AuthContext.Provider>
    </div>

  );
}

export default App;
