import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// console.log(`저장된 토큰: ${token}`);

const httpLink = createHttpLink({
  uri: "http://localhost:4001/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const cookie = document.cookie;
  // console.log(`내 쿠키: ${cookie}`);
  // 토큰을 로컬 스토리지 또는 세션 스토리지에서 가져오기
  const token = sessionStorage.getItem("accessToken");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "", // 토큰이 있다면 헤더에 추가
      Cookie: cookie ? `refreshToken ${cookie}` : "",
      credentials: "include", // 쿠키 정보 포함
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), // authLink를 httpLink에 연결
  cache: new InMemoryCache(),
  credentials: "include",
});

export default client;
