import React, { useEffect, useState } from "react";
import "../styles/CardList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";

import Masonry from "react-masonry-css";
import { useLocation, useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";

const FETCH_PRODUCTS = gql`
  query {
    fetchProducts {
      id
      name
      description
      url
      productTags {
        id
        name
      }
    }
  }
`;

const ADD_LIKE_MUTATION = gql`
  mutation AddLike($userId: String!, $productId: String!, $isLiked: Boolean!) {
    addLike(
      addLikeInput: {
        userId: $userId
        productId: $productId
        isLiked: $isLiked
      }
    ) {
      id
    }
  }
`;

const UPDATE_LIKE_MUTATION = gql`
  mutation UpdateLike($updateLikeInput: UpdateLikeInput!) {
    updateLike(updateLikeInput: $updateLikeInput) {
      like
    }
  }
`;

interface IproductTag {
  name: string;
}

interface Iproduct {
  id: string;
  name: string;
  description: string;
  productTags: IproductTag[];
  url: string;
}

interface Iproducts {
  fetchProducts: Iproduct[];
}

interface ClickedHearts {
  [key: string]: boolean;
}

interface ICardList {
  onRefetchNeeded: any;
  userid: string;
  likeData: any[];
}

interface IAddLike {
  userId: string;
  productId: string;
  isLiked: boolean;
}

interface IUpdateLike {
  userId: string;
  productId: string;
}

const CardList: React.FC<ICardList> = ({
  onRefetchNeeded,
  userid,
  likeData,
}) => {
  const Navigate = useNavigate();

  const [addLike] = useMutation<IAddLike>(ADD_LIKE_MUTATION);

  const [updateLike] = useMutation<IUpdateLike>(UPDATE_LIKE_MUTATION);

  const fetchItem = useQuery<Iproducts>(FETCH_PRODUCTS);

  const { loading, data, refetch } = fetchItem;

  const foundLike = (productId: string) => {
    const result =
      likeData && likeData.find((like) => like.product?.id === productId);

    return result;
  };

  const isLike = (productId: string) => {
    const result =
      likeData && likeData.find((like) => like.product?.id === productId);

    const isLiked = result && result.like;

    return isLiked;
  };

  useEffect(() => {
    onRefetchNeeded(refetch);
  }, [refetch, onRefetchNeeded]);

  if (loading) {
    return <div>Loading...</div>;
  }

  function handleClick(itemId: string) {
    Navigate(`/read/${itemId}`);
  }

  const breakpointColumnsObj = {
    default: 4, // 기본적으로 4열
    1100: 3, // 1100px 이상일 때 3열
    700: 2, // 700px 이상일 때 2열
    0: 1, // 0px 이상일 때 1열
  };

  const handleHeartClick = (productId: string) => {
    const find: any[] = foundLike(productId);

    if (!find) {
      addLike({
        variables: {
          userId: userid,
          productId: productId,
          isLiked: true,
        },
      });
    } else if (find) {
      updateLike({
        variables: {
          updateLikeInput: {
            userId: userid,
            productId: productId,
          },
        },
      });
    }
  };

  return (
    <div className="imageListContainer">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data &&
          [...data.fetchProducts].reverse().map((products) => (
            <div key={products.id} className="image-container">
              <img
                onClick={() => handleClick(products.id)}
                className="imgCard"
                src={products.url}
                alt={products.id}
              />
              <div className="image_footer_box">
                <div className="footer_text">{products.name}</div>
                <button
                  className="image_Btn"
                  onClick={() => handleHeartClick(products.id)}
                >
                  {isLike(products.id) ? (
                    <FontAwesomeIcon icon={fasHeart} style={{ color: "red" }} />
                  ) : (
                    <FontAwesomeIcon icon={farHeart} />
                  )}
                </button>
              </div>
            </div>
          ))}
      </Masonry>
    </div>
  );
};

export default CardList;
