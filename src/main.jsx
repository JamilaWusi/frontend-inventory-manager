import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from 'react-hot-toast';

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" />
      <App />
    </BrowserRouter>
  </StrictMode>
);








































// // frontend-inventory-manager/src/main.jsx
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router";

// import "./index.css";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>
// );