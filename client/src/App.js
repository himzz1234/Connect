import { lazy } from "react";
import { toast } from "react-toastify";
import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import axios from "./axios";
import Loading from "./components/Loading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  const [loading, setLoading] = useState(true);
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    async function fetchUser() {
      if (localStorage.getItem("userToken")) {
        dispatch({ type: "LOGIN_START" });

        try {
          const res = await axios.get("/auth/getauth", {
            headers: {
              "x-access-token": localStorage.getItem("userToken"),
            },
          });

          if (res.data.user) {
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
            setLoading(false);
          } else {
            toast.error("An error occurred!", {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "dark",
            });

            dispatch({
              type: "LOGIN_FAILURE",
              payload: "Something went wrong!",
            });
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
    <div className="bg-bodyPrimary w-full h-screen lg:overflow-y-hidden overflow-x-hidden font-opensans scrollbar">
      {loading ? (
        <Loading />
      ) : (
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={user ? <Home /> : <Register />} />
            <Route
              path="/login"
              element={user ? <Navigate replace to="/" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <Register />}
            />
          </Routes>
        </Suspense>
      )}

      <ToastContainer toastStyle={{ backgroundColor: "hsl(206,28%,15%)" }} />
    </div>
  );
}

export default App;
