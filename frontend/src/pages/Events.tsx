import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CreateLocation from './CreateLocation';
import CreateEvent from './createEvent';
import Navbar from './NavBar';
import axios from 'axios';
import { BASE_URL } from '../App';
import toast from 'react-hot-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isFlag, setIsFlag] = useState(false)
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  console.log('totalPage ', totalPage)

  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    const fun = async () => {
      
      const res = await axios({
        method: 'GET',
        url: `${BASE_URL}/events?location=${''}&category=${''}&date=${''}&page=${page}`,
        headers: {
          'Authorization': localStorage.getItem('auth-token')
        }
      })
      const data = res.data
      if (data.error) {
        toast.error(data.message || 'something went wrong! try again')
        return
      }
      console.log('data', data)
      setEvents(data.body.events);
      setTotalPage(data.body?.totalPages);
    }
    fun()
  }, [isFlag, page])


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateEvent = async (newEvent: any) => {

    console.log('newEvent', newEvent)
    if(newEvent.id !=-1){
      console.log('calling handleEdit function')
      handleEdit(newEvent.id, newEvent)
      return
    }
    else{
      console.log('calling handleCreate function')

    const res = await axios({
      method: 'POST',
      url: `${BASE_URL}/events`,
      headers: {
        'Authorization': localStorage.getItem('auth-token')
      },
      data: {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        category: newEvent.category,
        location_id: newEvent.location_id
      }
    })

    const data = res.data
    if (data.error) {
      toast.error(data.message || 'something went wrong! try again')
      return
    }

    setIsFlag(!isFlag)
    setCurrentEvent(null);

    setIsModalOpen(false); 
   } };



  const handleDelete = async (id: number) => {
    try {
      const res = await axios({
        method: 'DELETE',
        url: `${BASE_URL}/events/${id}`,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      })
      const data = res.data
      if (data.error) {
        toast.error(data.message || 'something went wrong! try again')
        return
      }
      setIsFlag(!isFlag)
    } catch (error) {
      console.log('catch block', error)
    }
  };
  
  

 
  const handleEditfunction = async (id: number, event: any) => {
    setCurrentEvent({ ...event, location_id: event.location_id.id });
    setIsModalOpen(true);
  }

  const handleEdit = async (id: number, event: any) => {
    setCurrentEvent({ ...event, location_id: event.location_id.id });
    setIsModalOpen(true);
    const res = await axios({
      method: 'put',
      url: `${BASE_URL}/events/${id}`,
      headers: {
        'Authorization': localStorage.getItem('auth-token')
      },
      data: {
        title: event.title,
        description: event.description,
        date: event.date,
        category: event.category,
        location_id: event.location_id
      }
    })
    const data = res.data
    if (data.error) {
      toast.error(data.message || 'something went wrong! try again')
      return
    }
    setIsFlag(!isFlag)
    
    setCurrentEvent(null);

    setIsModalOpen(false);
  }



  return (
    <Container>
      <Navbar />
      <HeaderRow>

        <Header>Event List</Header>

        <CreateButton onClick={() => setIsModalOpen(true)}>Create Event</CreateButton>
      </HeaderRow>

      <CardGrid>
        {events.map((event: any) => (
          <Card key={event.id}>
            <CardTitle>{event.title}</CardTitle>
            <CardDetail>{event.category}</CardDetail>
            {/* <CardDetail>{event.city}, {event.state}</CardDetail> */}
            <CardDetail>{event.description}</CardDetail>
            <CardDetail>Date :{event.date}</CardDetail>
            <CardDetail>Location :{event.location_id?.name}{event.location_id?.address}</CardDetail>
            {/* <CardDetail>Created At: {new Date(event.created_at).toLocaleString()}</CardDetail> */}
            <ButtonContainer>
              <EditButton onClick={() => handleEditfunction(event.id, event)}>Edit</EditButton>
              <DeleteButton onClick={() => {
                if(window.confirm("Are you sure you want to delete this event?")) {
                  handleDelete(event.id)
                }
              }}>Delete</DeleteButton>
            </ButtonContainer>
          </Card>
        ))}
      </CardGrid>
      {isModalOpen && (
        <ModalBackdrop>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            <CreateEvent onSaveEvent={handleCreateEvent} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} currentEvent={currentEvent} />
          </ModalContent>
        </ModalBackdrop>
      )}
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
      {page}
      <button onClick={() => setPage(page + 1)} disabled={page == totalPage}>Next</button>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Header = styled.h2`
  font-size: 1.8rem;
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
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CreateButton = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  width: 400px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const EditButton = styled.button`
  padding: 5px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e53935;
  }
`;

export default Events;
