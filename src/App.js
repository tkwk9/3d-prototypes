import { render } from "solid-js/web";
import { Router, Route, Routes, A, Navigate } from "@solidjs/router";
import Base from "./pages/Base.js";
import SvgTest from "./pages/SvgTest.js";
import "./App.scss";

const NavBar = () => (
  <div className="NavBar">
    <A href="/">Home</A>
    <A href="/SvgTest">SvgTest</A>
  </div>
);

const Content = () => {
  return (
    <div className="Content">
      <Routes>
        <Route path="/" end component={() => Base} />
        <Route path="/SvgTest" end component={() => SvgTest} />
        {/* <Route path="/route" end component={Component} /> */}
        <Route path="*" end element={<Navigate href={"/"} />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <NavBar />
    <Content />
  </Router>
);

render(() => <App />, root);
