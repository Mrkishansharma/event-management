import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import RouteConstants from "../routes/routeConstants";
import { registerUser } from "../features/auth/controller/authController";
import { Toaster } from "react-hot-toast";
import { RegisterUserType } from "../features/auth/authTypes";



const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  console.log(userData)

  return (
    <Container>
      <FormCard>
        <Title>Create an account</Title>
        <Subtitle>Enter your email below to create your account</Subtitle>
        <Form onSubmit={async (e) => {
          const data = await registerUser(userData, e)
          // if(data){
          //   navigate(RouteConstants.signin)
          // }
        }}>
          {/* <Toaster /> */}
          <div>
            <Label>Name</Label>
            <Input onChange={(e) => setUserData(prev => ({...prev, name: e.target.value}))} type="text" placeholder="enter your name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input onChange={(e) => setUserData(prev => ({...prev, email: e.target.value}))} type="email" placeholder="enter email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input onChange={(e) => setUserData(prev => ({...prev, password: e.target.value}))} type="password" placeholder="enter password" />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input onChange={(e) => setUserData(prev => ({...prev, confirmPassword: e.target.value}))} type="password" placeholder="confirm password" />
          </div>
          <Button type="submit">
            <span>👤</span> Sign Up
          </Button>
        </Form>
        <Footer>
          <Subtitle>
            Already have an account? 
            <SpanElement onClick={() => navigate(RouteConstants.signin)}>{' '}signin</SpanElement> 
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
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
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

export default Signup;
