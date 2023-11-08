import React, { useEffect, useState } from "react";
import CardList from "../component/CardList";
import { useLocation } from "react-router-dom";
import { ApolloQueryResult, gql, useQuery } from "@apollo/client";

const FETCH_LIKES_BY_USER = gql`
  query FetchLikes($userid: String!) {
    fetchLikes(userid: $userid) {
      like
      user {
        id
      }
      product {
        id
      }
    }
  }
`;

interface IHomePage {
  userid: any;
}

const HomePage: React.FC<IHomePage> = ({ userid }) => {
  const { loading, error, data } = useQuery(FETCH_LIKES_BY_USER, {
    variables: { userid },
  });

  const LikeData: [] = data && data?.fetchLikes;

  const [refetch, setRefetch] = useState<
    (() => Promise<ApolloQueryResult<any>>) | null
  >(null);
  const location = useLocation();

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [location, refetch]);

  const handleRefetchNeeded = (newRefetch: any) => {
    setRefetch(() => newRefetch);
  };

  return (
    <CardList
      onRefetchNeeded={handleRefetchNeeded}
      userid={userid}
      likeData={LikeData}
    />
  );
};

export default HomePage;
