import React, { useReducer } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import RouteConstants from "../routes/routeConstants";
import axios from "axios";
import { BASE_URL } from "../App";
import toast from "react-hot-toast";

const intialState = {
  email: "",
  password: ""
}

const reducer = (state: any, { type, payload }: any) => {
  switch (type) {
    case "email": return { ...state, email: payload }
    case "password": return { ...state, password: payload }
    default: return state
  }
}
const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, intialState);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(state)

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, state);
      const data = response.data;
      if (data.error) {
        toast.error(data.message || 'something went wrong! try again');
        return;
      }
      if (data.message) toast.success(data.message);
      localStorage.setItem('auth-token', data.body.token);
      localStorage.setItem('role', data.body.role);
      localStorage.setItem('user-name', data.body.name);
      console.log("before 123");
      
      navigate(RouteConstants.home);
      console.log("before 1233");

    } catch (error) {
      console.error("Error during login:", error);
      toast.error('Invalid Credentials');
    }

  }

  return (
    <Container>
      <FormCard>
        <Title>Login to your account</Title>
        <Subtitle>Enter your email and password to continue</Subtitle>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="enter email" value={state.email} onChange={(e) => dispatch({ type: "email", payload: e.target.value })} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" placeholder="enter password" value={state.password} onChange={(e) => dispatch({ type: "password", payload: e.target.value })} />
          </div>
          <Button type="submit">
            <span>👤</span> Login
          </Button>
        </Form>
        <Footer>
          <Subtitle>
            Don't have an account?
            <SpanElement onClick={() => navigate(RouteConstants.signup)}>{' '}signup</SpanElement>
          </Subtitle>
        </Footer>
      </FormCard>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  text-align: start;
`;

const SpanElement = styled.span`
  text-decoration: underline;
  color: #007FFF;
  cursor: pointer;
`;

const FormCard = styled.div`
  background: white;
  width: 400px;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: start;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  padding-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #495057;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  background-color: black;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;

const Footer = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 1rem;

  a {
    color: black;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Signin;
