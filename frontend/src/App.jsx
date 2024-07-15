import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./forms/SignIn";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
      </Routes>
    </>
  );
}

export default App;
