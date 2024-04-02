import { lazy } from "react";
import { Suspense, useContext, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import axios from "./axios";
import Loading from "./components/Loading";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  const [loading, setLoading] = useState(true);
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    async function fetchUser() {
      dispatch({ type: "LOGIN_START" });

      try {
        const res = await axios.get("/auth/getauth", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (res.data.user) {
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
          setLoading(false);
        } else {
          dispatch({
            type: "LOGIN_FAILURE",
            payload: "Something went wrong!",
          });
          setLoading(false);
        }
      } catch (err) {
        console.log(err.message);

        dispatch({ type: "LOGIN_FAILURE", payload: "Something went wrong!" });
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="font-sans bg-secondary w-full min-h-screen lg:h-screen lg:overflow-y-hidden overflow-x-hidden scrollbar scrollbar-none">
      {loading ? (
        <Loading />
      ) : (
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/register" replace />}
            />
            <Route
              path="/login"
              element={user ? <Navigate replace to="/" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <Register />}
            />
            <Route
              path="/resetpassword/:token"
              element={user ? <Navigate to="/" replace /> : <ResetPassword />}
            />
          </Routes>
        </Suspense>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
