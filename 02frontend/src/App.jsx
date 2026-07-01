import { Outlet } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Loader from "./components/Loader";

function App() {

  const { loading } = useContext(AuthContext);

  return (

    loading ? (<Loader />) : (<div className="mainContainer">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>)

  )
}

export default App
