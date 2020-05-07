import React from 'react';
import { Switch, Route } from "react-router-dom";
//import logo from './logo.svg';
//import './App.css';
import test from './components/test';


function App() {

  return (
    <div className="App">
      {console.log("in app div")}
      <Switch>
        {console.log("in switch")}
        {/* <Route path="/" component={<div> </div>} /> */}
        <Route exact path="/test" component={test} />
      </Switch>
    </div>

  );
}
export default App;
