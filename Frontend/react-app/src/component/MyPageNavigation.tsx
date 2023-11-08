import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/MyPageNavigation.css";

const MyPageNavigation = (): JSX.Element => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <nav className="mypage_navbar">
      <ul className="menu">
        <li className="menu_li">
          <Link to="/mypage">생성</Link>
        </li>
        <li className="menu_li">
          <Link to="/mypage_like">좋아요</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MyPageNavigation;
