import React, { useEffect, useState } from "react";
import "../styles/Comment.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FETCH_COMMENTS = gql`
  query {
    fetchComments {
      comment
      user {
        id
        name
      }
      product {
        id
      }
    }
  }
`;

const ADD_COMMENTS = gql`
  mutation CreateComment($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      id
      comment
    }
  }
`;

interface MyPageProps {
  itemid?: string;
  userid?: string;
}

interface Iuser {
  name: string;
}

interface Icomments {
  comment: string;
  user: Iuser;
}

const Comment: React.FC<MyPageProps> = ({ itemid, userid }) => {
  const [comment, setComment] = useState("");

  const [userComments, setUserComments] = useState<Icomments[]>([]);

  const [createComment] = useMutation(ADD_COMMENTS, {
    onCompleted: () => {
      refetch();
    },
  });

  const fetchComments = useQuery(FETCH_COMMENTS);

  const { loading, data, refetch } = fetchComments;

  useEffect(() => {
    if (data && data.fetchComments) {
      console.log("필터링 되기 전:", data.fetchComments);
      const filteredComments = data.fetchComments.filter(
        (comment: any) => comment.product.id === itemid
      );
      console.log("필터링 된 후:", filteredComments);
      setUserComments(filteredComments);
    }
  }, [data, itemid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!comment) return;

    try {
      const response = await createComment({
        variables: {
          createCommentInput: {
            comment: comment,
            userId: userid,
            productId: itemid,
          },
        },
      });

      console.log(response.data.createComment);
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="comment-app">
      <hr />
      <ul className="comment-list">
        {userComments.map((comment, index) => (
          <li key={index} className="comment-item">
            <div className="comment_user_info_img">{comment.user.name}</div>
            {comment.comment}
            {/* <button onClick={() => handleDeleteComment(index)}>삭제</button> */}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="comment-input">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>
    </div>
  );
};

export default Comment;
