import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RouteConstants from '../routes/routeConstants';
import Navbar from './NavBar';
import { BASE_URL } from '../App';
import axios from 'axios';


const MyEvents = () => {
    const [eventsData, setEventsData] = useState([]);
    const navigate = useNavigate();
    console.log('eventsData ', eventsData)

    useEffect(() => {

    }, [window.innerWidth])

    const fun = async () => {
        const res = await axios({
            method: 'GET',
            url: `${BASE_URL}/events/registrations`,
            headers: {
                'Authorization': localStorage.getItem('auth-token')
            }
        })
        const data = res.data;
        if (data.error) {
            alert(data.message || 'something went wrong! try again');
            return;
        }
        if (data.message) alert(data.message);
        console.log(data.body)
        setEventsData(data.body);
    }
    useEffect(() => {
        fun();

    }, [])
    const handleRegisterEvent = async (id: number) => {
        const res = await axios({
            method: 'post',
            url: `${BASE_URL}/events/${id}/cancel`,
            headers: {
                'Authorization': localStorage.getItem('auth-token')
            }
        })
        const data = res.data;
        if (data.error) {
            alert(data.message || 'something went wrong! try again');
            return;
        }
        if (data.message) alert(data.message);
        fun();
        console.log(data.body)
    }

    return (
        <Container>
            <Navbar />
            <Header>Event Dashboard</Header>


            <CardGrid>
                {eventsData.map((item: any) => (
                    <Card key={item.event.title}>
                        <CardTitle>{item.event.title}</CardTitle>
                        <CardDetail>🔖 {item.event.category}</CardDetail>
                        <CardDetail>🔖 {item.event.description}</CardDetail>
                        <CardDetail>📅 {item.event.date}</CardDetail>
                        <CardDetail>📅 Registration Date: {item.registration_date}</CardDetail>
                        <CardDetail>Status:  {item.status}</CardDetail>
                        <ViewButton onClick={() => handleRegisterEvent(item.event.id)}>Unregister Event</ViewButton>
                    </Card>
                ))}
            </CardGrid>
        </Container>
    );
};



const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Filters = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-direction: ${window.innerWidth < 500 ? 'column' : 'row'};
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  flex: 1;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  flex: 1;
`;

const DateInput = styled(Input).attrs({ type: 'date' })`
  flex: 1;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const CardTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardDetail = styled.div`
  font-size: 0.9rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ViewButton = styled.button`
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;

export default MyEvents;