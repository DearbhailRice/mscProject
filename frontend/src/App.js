import React from 'react';
import { Switch, Route } from "react-router-dom";
import test from './components/test';
import learningProfile from './components/learning-profile';
import personalProfile from './components/personalProfile';
import login from './components/login';
import personalProfileEdit from './components/personalInfo/edit.js';
function App() {

  return (
    <div className="App">
      {console.log("in app div")}
      <Switch>
        {console.log("in switch")}

        <Route exact path="/test" component={test} />
        <Route exact path="/login" component={login} />
        <Route exact path="/learning-profile" component={learningProfile} />
        <Route exact path="/personal-profile" component={personalProfile} />
        <Route exact path="/personalProfile/edit" component={personalProfileEdit} />

      </Switch>
    </div>

  );
}
export default App;
