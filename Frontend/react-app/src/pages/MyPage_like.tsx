import MyPageNavigation from "../component/MyPageNavigation";
import "../styles/MyPage.css";

interface MyPageProps {
  email: string;
  name: string;
}

const MyPage_like: React.FC<MyPageProps> = ({ email, name }) => {
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
      <div className="user_item">좋아요 리스트</div>
    </div>
  );
};

export default MyPage_like;
