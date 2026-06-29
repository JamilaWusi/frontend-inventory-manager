import { useState } from "react";
import "./App.css";
import Landing from "./landing";
import Signup from "./signup";
import Dashboard from "./dashboard";
import Login from "./Login";

function App() {
  const [page, setPage] = useState("login"); // default page

  return (
    <div className="App">
      {page === "landing" && <Landing />}
      {page === "signup" && <Signup />}
      {page === "dashboard" && <Dashboard />}
      {page === "login" && <Login />}

      {/* Simple navigation buttons for testing */}
      <div className="mt-4 flex gap-2 justify-center">
        <button onClick={() => setPage("landing")}>Landing</button>
        <button onClick={() => setPage("signup")}>Signup</button>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("login")}>Login</button>
      </div>
    </div>
  );
}

export default App;
