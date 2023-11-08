import React, { useEffect, useState } from "react";
import "../styles/SignupPage.css";
import { gql, useMutation } from "@apollo/client";

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!, $password: String!) {
    createUser(email: $email, password: $password, name: $name) {
      id
      email
      name
    }
  }
`;

interface IFormData {
  email: string;
  email_confirm: string;
  username: string;
  password: string;
  password_confirm: string;
}

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    email_confirm: "",
    username: "",
    password: "",
    password_confirm: "",
  });

  const { validText, validPassword, isValid } = useValid(formData);

  function useValid(changeValue: IFormData) {
    const [validText, setValidText] = useState("");
    const [validPassword, setValidPassword] = useState("");
    const [isValid, setIsValid] = useState({
      isEmailConfirm: false,
      isPasswordConfirm: false,
    });
    useEffect(() => {
      if (changeValue.email !== changeValue.email_confirm) {
        setValidText("이메일이 같지 않습니다");
        setIsValid({ ...isValid, isEmailConfirm: false });
      } else {
        setValidText("");
        setIsValid({ ...isValid, isEmailConfirm: true });
      }
    }, [changeValue.email_confirm]);
    useEffect(() => {
      if (changeValue.password !== changeValue.password_confirm) {
        setValidPassword("비밀번호가 같지 않습니다");
        setIsValid({ ...isValid, isPasswordConfirm: false });
      } else {
        setValidPassword("");
        setIsValid({ ...isValid, isPasswordConfirm: true });
      }
    }, [changeValue.password_confirm]);
    return { validText, validPassword, isValid };
  }

  const [errors, setErrors] = useState({
    email: "",
    email_confirm: "",
    password: "",
    password_confirm: "",
  });

  useEffect(() => {
    // 컴포넌트가 마운트될 때 초기값 설정
    setFormData({
      email: "",
      email_confirm: "",
      username: "",
      password: "",
      password_confirm: "",
    });
  }, []);

  const [createUser] = useMutation(CREATE_USER);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createUser({
        variables: {
          email: formData.email,
          name: formData.username,
          password: formData.password,
          // age: 15, // 예시로 나이를 고정 값으로 설정
        },
      });

      console.log("User created:", result.data.createUser);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign-up</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Name</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email_confirm</label>
          <input
            type="email"
            id="email"
            name="email_confirm"
            value={formData.email_confirm}
            onChange={handleInputChange}
          />
          <div style={{ color: "red" }}>{validText}</div>
        </div>
        <div className="form-group">
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ color: "red" }}>{errors.password}</div>
        <div className="form-group">
          <label htmlFor="password">password_confirm</label>
          <input
            type="password"
            id="password"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleInputChange}
          />
          <div style={{ color: "red" }}>{validPassword}</div>
        </div>
        <button
          type="submit"
          className="submit"
          disabled={
            !isValid.isEmailConfirm ||
            !isValid.isPasswordConfirm ||
            Object.values(formData).some((value) => value === "")
          }
        >
          Sign-up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
