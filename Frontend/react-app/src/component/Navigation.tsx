import { Link } from "react-router-dom";
import "../styles/Navigation.css";
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SearchBar } from "./SearchBar";

const USER_LOGOUT = gql`
  mutation {
    Logout
  }
`;

interface INavigation {
  isLogin: boolean;
}

const Navigation: React.FC<INavigation> = ({ isLogin }) => {
  const [userLogout] = useMutation(USER_LOGOUT);

  // console.log(`로긴여부 ${isLogined}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await userLogout();

      const Data = result.data;

      window.location.reload();
      console.log("User Logout:", Data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <nav className="navbar">
      <ul className="left-menu">
        <li>
          <Link to="/">MIM</Link>
        </li>
      </ul>
      {/* <div className="right-menu"> */}
      <div className="search_bar">
        <SearchBar />
      </div>
      <div
        className="dropdown"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <button className="dropbtn">Menu</button>
        {showDropdown && (
          <div className="dropdown-content">
            {isLogin ? null : <Link to="/login">Login</Link>}
            {isLogin ? null : <Link to="/signup">Sign-up</Link>}
            <Link to="/mypage">My-page</Link>
            <Link to="/make">Make</Link>
            {isLogin ? (
              <Link to="/login" onClick={handleSubmit}>
                Logout
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
