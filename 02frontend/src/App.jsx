import { Outlet } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Loader from "./components/Loader";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {

  const { loading } = useContext(AuthContext);

  return (

    loading ? (<>
      <Loader />
      <h4 className="dashboardLoadingText">First Loading May Take Time, Please wait for a while...  </h4>
    </>) : (<div className="mainContainer">
      <Navbar />
      <main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>)

  )
}

export default App
