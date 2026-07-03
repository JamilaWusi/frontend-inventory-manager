// frontend-inventory-manager/src/App.jsx
import ProfileProvider from "./context/ProfileContext";
import SupplierProvider from "./context/SupplierContext";
import TokenProvider from "./context/TokenContext";
import Navigation from "./pages/Navigation";


function App() {

  return (
    <TokenProvider>
      <SupplierProvider>
        <ProfileProvider>
          <Navigation />
        </ProfileProvider>
      </SupplierProvider>
    </TokenProvider>
  );
}




export default App;

