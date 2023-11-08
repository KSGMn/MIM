import React from "react";
import Comment from "../component/Comment";
import "../styles/ReadPage.css";
import Slide from "../component/Slide";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

type Image = {
  label: string;
  alt: string;
  url: string;
};

const FETCH_PRODUCT = gql`
  query FetchProduct($productId: String!) {
    fetchProduct(productId: $productId) {
      id
      name
      description
      url
      userName
      userEmail
      user {
        id
        name
      }
    }
  }
`;

type ReadPageProps = {
  userid: string;
  // email: string;
  // name: string;
};

const ReadPage: React.FC<ReadPageProps> = ({ userid }) => {
  let { itemId } = useParams();
  console.log(`제품아이디: ${itemId}`);

  const { data } = useQuery(FETCH_PRODUCT, {
    variables: { productId: itemId },
  });

  if (data && data.fetchProduct) {
    console.log(`데이터 ${data.fetchProduct.user.id}`);
  }

  return (
    <div className="readContainer">
      <div className="read_container1">
        <div className="read_image">
          <div className="read_image_box">
            <Slide images={data?.fetchProduct.url} />
          </div>
        </div>

        <div className="read_box">
          <div className="read_box1">
            <div className="left_box">
              {" "}
              <div className="read_image_user">
                <div className="read_user_info">
                  <div className="read_user_info_img">
                    {data?.fetchProduct.user.name}
                  </div>
                  <div className="read_user_info_name">
                    <h3 className="read_user_info_h3">
                      {data?.fetchProduct.userName}
                    </h3>

                    <p>팔로잉</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="right_box">
              <p className="read_title">{data?.fetchProduct.name}</p>
              <p className="read_desc">{data?.fetchProduct.description}</p>
            </div>
          </div>
          <div className="read_box2">
            <Comment itemid={itemId} userid={userid} />
          </div>
        </div>
      </div>
      <div className="read_container2"></div>
    </div>
  );
};

export default ReadPage;
