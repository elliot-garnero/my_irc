import React from 'react';
import './App.css';
import Login from './components/Login';
import Homepage from './components/Homepage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/home" component={Homepage} />
          {/* <Route path="/channels/:id" component={ChannelDetail} /> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
