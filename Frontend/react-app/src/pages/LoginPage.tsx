import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const USER_LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setFormData({
      email: "",
      password: "",
    });
  }, []);

  const [userLogin] = useMutation(USER_LOGIN);

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
      const result = await userLogin({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      const Data = result.data.login;

      sessionStorage.setItem("accessToken", Data);

      window.location.reload();

      const token = sessionStorage.getItem("accessToken");
      console.log("저장된 세션 토큰:", token);

      console.log("User Login:", Data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
