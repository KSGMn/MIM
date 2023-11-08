import React, { useEffect, useState } from "react";
import "../styles/NomarCardList.css";
import { gql, useQuery } from "@apollo/client";
import { Navigate, useNavigate } from "react-router-dom";

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
      user {
        id
      }
    }
  }
`;

interface MyPageProps {
  userid: string;
}

interface Iuser {
  id: string;
}
interface IproductTag {
  name: string;
}

interface Iproduct {
  id: string;
  name: string;
  description: string;
  productTags: IproductTag[];
  url: string;
  user: Iuser;
}

interface Iproducts {
  fetchProducts: Iproduct[];
}

const NomarCardList: React.FC<MyPageProps> = ({ userid }) => {
  const Navigate = useNavigate();
  const [userProducts, setUserProducts] = useState<Iproduct[]>([]);
  const fetchItem = useQuery<Iproducts>(FETCH_PRODUCTS);

  const { loading, data } = fetchItem;

  useEffect(() => {
    if (data && data.fetchProducts) {
      const filteredProducts = data.fetchProducts.filter(
        (product) => product.user.id === userid
      );
      setUserProducts(filteredProducts);
    }
  }, [data, userid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  function handleClick(itemId: string) {
    Navigate(`/read/${itemId}`);
  }

  return (
    <div className="image-list-container">
      {userProducts.map((product) => (
        <div key={product.id} className="image-item">
          <img
            src={product.url}
            className="image"
            onClick={() => handleClick(product.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NomarCardList;
