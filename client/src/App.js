import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import Loading from "./components/Loading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [loading, setLoading] = useState(true);
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    async function fetchUser() {
      if (localStorage.getItem("userToken")) {
        dispatch({ type: "LOGIN_START" });

        try {
          const res = await axios.get(
            "http://localhost:8800/api/auth/getauth",
            {
              headers: {
                "x-access-token": localStorage.getItem("userToken"),
              },
            }
          );

          if (res.data.user) {
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
            setLoading(false);
          }
        } catch (err) {
          dispatch({ type: "LOGIN_FAILURE", payload: err });
          setLoading(false);
        }
      } else setLoading(false);
    }

    fetchUser();
  }, []);

  return (
    <div className="bg-bodyPrimary h-screen overflow-y-hidden overflow-x-hidden font-opensans scrollbar">
      {loading ? (
        <Loading />
      ) : (
        <Routes>
          <Route path="/" element={user ? <Home /> : <Register />} />
          <Route
            path="/login"
            element={user ? <Navigate replace to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate replace to="/" /> : <Register />}
          />
        </Routes>
      )}

      <ToastContainer toastStyle={{ backgroundColor: "hsl(206,28%,15%)" }} />
    </div>
  );
}

export default App;
