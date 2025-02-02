import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RouteConstants from '../routes/routeConstants';
import Navbar from './NavBar';
import { BASE_URL } from '../App';
import axios from 'axios';
import toast, { ToastBar } from 'react-hot-toast';
import AppLoader from '../components/AppLoader';
import { EventContext } from '../contexts/EventContext';
import { useEventContext } from '../hooks/useEventContext';


const EventDashboard = () => {
  const [eventsData, setEventsData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, seDate] = useState('')
  const { events, setEvents } = useEventContext();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  console.log('totalPage ', totalPage)

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const categories = Array.from(new Set(events.map((event: any) => event.category)));

 

  useEffect(() => {

  }, [window.innerWidth])

  useEffect(() => {
    console.log(search, selectedCategory, date)
    const fun = async () => {
      setIsLoading(true);
      try {
        const res = await axios({
          method: 'GET',
          url: `${BASE_URL}/events?location=${search}&category=${selectedCategory}&date=${date}&page=${page}`,
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        })
        const data = res.data;
        if (data.error) {
          toast.error(data.message || 'something went wrong! try again');
          return;
        }
        if (data.message) toast.success(data.message);
        console.log(data.body)
        // setEventsData(data.body?.events);
        setEvents(data.body?.events);
        setTotalPage(data.body?.totalPages);
      } catch (error:any) {
        toast.error(error.message)
      } finally {
        setIsLoading(false);
      }
    }
    fun();

  }, [search, selectedCategory, date, page])

  return (
    <>
    { isLoading ? <AppLoader /> : <Container>
      <Navbar />
      <Header>Event Dashboard</Header>

      <Filters>
        <Input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option key={'uniqueID'} value={""}>
            All Categories
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <DateInput placeholder="dd/mm/yyyy" value={date} onChange={(e) => seDate(e.target.value)} />
      </Filters>
      <CardGrid>
        {events.map((event: any) => (
          <Card key={event.title}>
            <CardTitle>{event.title}</CardTitle>
            <CardDetail>📅 {event.date}</CardDetail>
            <CardDetail>🔖 {event.category}</CardDetail>
            <CardDetail>📍{event.location_id.name}{event.location_id.address}{event.location_id.city}{event.location_id.state}
              {event.location_id.country}
            </CardDetail>
            <ViewButton onClick={() => navigate(`${RouteConstants.eventDetails}/${event.id}`)}>View Details</ViewButton>
          </Card>
        ))}
      </CardGrid>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
      {page}
      <button onClick={() => setPage(page + 1)} disabled={page == totalPage}>Next</button>
    </Container>}
    </>
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

export default EventDashboard;