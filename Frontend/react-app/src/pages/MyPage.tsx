import { gql, useQuery } from "@apollo/client";
import MyPageNavigation from "../component/MyPageNavigation";
import NomarCardList from "../component/NomarCardList";
import "../styles/MyPage.css";
import { useEffect, useState } from "react";

const imageList = [
  "https://cdn.pixabay.com/photo/2020/09/02/20/52/dock-5539524__340.jpg",
  "https://cdn.pixabay.com/photo/2021/02/03/13/54/cupcake-5978060__340.jpg",
  "https://cdn.pixabay.com/photo/2020/05/25/20/14/holland-iris-5220407__340.jpg",
  "https://cdn.pixabay.com/photo/2020/10/08/17/39/waves-5638587__340.jpg",
  "https://cdn.pixabay.com/photo/2019/01/30/11/17/zebra-3964360__340.jpg",
  "https://cdn.pixabay.com/photo/2020/09/02/20/52/dock-5539524__340.jpg",
  "https://cdn.pixabay.com/photo/2021/02/03/13/54/cupcake-5978060__340.jpg",
  "https://cdn.pixabay.com/photo/2020/05/25/20/14/holland-iris-5220407__340.jpg",
  "https://cdn.pixabay.com/photo/2020/10/08/17/39/waves-5638587__340.jpg",
  "https://cdn.pixabay.com/photo/2019/01/30/11/17/zebra-3964360__340.jpg",
  "https://cdn.pixabay.com/photo/2020/09/02/20/52/dock-5539524__340.jpg",
  "https://cdn.pixabay.com/photo/2021/02/03/13/54/cupcake-5978060__340.jpg",
  "https://cdn.pixabay.com/photo/2020/05/25/20/14/holland-iris-5220407__340.jpg",
  "https://cdn.pixabay.com/photo/2020/10/08/17/39/waves-5638587__340.jpg",
  "https://cdn.pixabay.com/photo/2019/01/30/11/17/zebra-3964360__340.jpg",
  "https://cdn.pixabay.com/photo/2020/09/02/20/52/dock-5539524__340.jpg",
  "https://cdn.pixabay.com/photo/2021/02/03/13/54/cupcake-5978060__340.jpg",
  "https://cdn.pixabay.com/photo/2020/05/25/20/14/holland-iris-5220407__340.jpg",
  "https://cdn.pixabay.com/photo/2020/10/08/17/39/waves-5638587__340.jpg",
  "https://cdn.pixabay.com/photo/2019/01/30/11/17/zebra-3964360__340.jpg",
  // 추가 이미지 경로를 필요에 따라 계속 추가
];

interface MyPageProps {
  email: string;
  name: string;
  userid: string;
}

const MyPage: React.FC<MyPageProps> = ({ email, name, userid }) => {
  return (
    <div className="my_page">
      <div className="user_info">
        <div className="user_info_box">
          {/* <img src="user-avatar.jpg" alt="프로필 사진" /> */}
          <div className="user_info_img">{name}</div>
          <div className="user_info_name">
            <h1 className="user_info_h1">{name}</h1>
            <p>{email}</p>
            <p>팔로잉</p>
          </div>
        </div>
      </div>
      <MyPageNavigation />
      <div className="user_item">
        <NomarCardList userid={userid} />
      </div>
    </div>
  );
};

export default MyPage;
