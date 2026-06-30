
import { Routes, Route } from "react-router";
import { useState } from "react";
import "./App.css";

import Input from "./components/Input";
import Login from "./pages/Login"
import Category from "./pages/Category";
import Supplier from "./pages/Suppliers";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CriticalStock from "./pages/CriticalStock";

import {MdOutlinePerson} from 'react-icons/md'
import Signup from "./pages/Signup";
import Card from "./components/Card";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("login"); // default page

  return (
    
    <div className="App">
      {/* {page === "landing" && <Landing />}
      {page === "signup" && <Signup />}
      {page === "dashboard" && <Dashboard />}
      {page === "login" && <Login />} */}

      

      <Routes>
        

        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />




        <Route 
          path="/categories" 
          element={<Category />} 
        />

        <Route 
          path="/suppliers" 
          element={<Supplier />} 
        />

        <Route 
          path="/inventory" 
          element={<Inventory />} 
        />

        <Route 
          path="/products" 
          element={<Products/>} 
        />

        <Route 
          path="/profile" 
          element={<Profile />} 
        />

        <Route 
          path="/settings" 
          element={<Settings />} 
        />

      </Routes>

    

  


      
      

      {/* Simple navigation buttons for testing */}
      {/* <div className="mt-4 flex gap-2 justify-center">
        <button onClick={() => setPage("landing")}>Landing</button>
        <button onClick={() => setPage("signup")}>Signup</button>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("login")}>Login</button>
      </div> */}
    </div>

    
  );
}



    
export default App;

