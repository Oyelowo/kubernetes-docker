import React from "react";
import { BrowserRouter, Link, Route } from "react-router-dom";
import "./App.css";
import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Link to="/">Home</Link>
        <Link to="/otherpage">Other Page</Link>

        <section>
          <Route exact path="/">
            <Fib />
          </Route>
          <Route exact path="/otherpage">
            <OtherPage />
          </Route>
        </section>
      </div>
    </BrowserRouter>
  );
}

export default App;
