import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navigation from "./component/Navigation";
import "./styles/App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { gql, useQuery } from "@apollo/client";
import MyPage from "./pages/MyPage";
import MyPage_like from "./pages/MyPage_like";
import ReadPage from "./pages/ReadPage";
import MakePage from "./pages/MakePage";

const GET_USER_PROFILE = gql`
  query {
    fetchUser
  }
`;

const App = () => {
  const userData = useQuery(GET_USER_PROFILE);

  const isLogin = userData.data ? true : false;
  const userId = userData.data ? userData.data.fetchUser[0] : null;
  const userEmail = userData.data ? userData.data.fetchUser[1] : null;
  const userName = userData.data ? userData.data.fetchUser[2] : null;

  return (
    <div className="App">
      <BrowserRouter>
        <Navigation isLogin={isLogin} />
        <Routes>
          <Route
            path="/make"
            element={
              isLogin ? (
                <MakePage id={userId} email={userEmail} name={userName} />
              ) : (
                <Navigate to="/login" />
              )
            }
          ></Route>
          <Route
            path="/read/:itemId"
            element={
              isLogin ? <ReadPage userid={userId} /> : <Navigate to="/login" />
            }
          ></Route>
          <Route
            path="/mypage_like"
            element={
              isLogin ? (
                <MyPage_like name={userName} email={userEmail} />
              ) : (
                <Navigate to="/login" />
              )
            }
          ></Route>
          <Route
            path="/mypage"
            element={
              isLogin ? (
                <MyPage name={userName} email={userEmail} userid={userId} />
              ) : (
                <Navigate to="/login" />
              )
            }
          ></Route>
          <Route
            path="/login"
            element={isLogin ? <Navigate to="/" /> : <LoginPage />}
          ></Route>
          <Route
            path="/signup"
            element={isLogin ? <Navigate to="/" /> : <SignupPage />}
          ></Route>
          <Route
            path="/"
            element={
              isLogin ? <HomePage userid={userId} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
