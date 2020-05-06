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
        {/* <Route exact path="/test" component={test} /> */}
        <Route exact path="/test" component={test} />
      </Switch>
    </div>

  );
}
export default App;


// class App extends Component {

//   constructor(props) {
//     super(props);
//     this.state = { apiResponse: "" };
//   }

//   callAPI() {
//     fetch("http://localhost:9000/testAPI")
//       .then(res => res.text())
//       .then(res => this.setState({ apiResponse: res }));

//   }

//   testApiToDBConn() {
//     fetch("http://localhost:3001/test")
//       .then(res => res.text())
//       .then(res => this.setState({ dbApiResponse: res }));

//   }

//   componentDidlMount() {
//     this.callAPI();
//     this.testApiToDBConn();

//   }
//   render() {
//     console.log(this.state.dbApiResponse);
//     console.log(this.state.apiResponse);
//     return (
//       <div className="App">
//         {console.log("in app div")}

//         <Switch>
//           {console.log("in switch")}
//           <Route path="/" component={<div></div>} />
//           <Route exact path="/test" component={test} />
//         </Switch>
//       </div>
//     );
//   }
// }

//export default App;
