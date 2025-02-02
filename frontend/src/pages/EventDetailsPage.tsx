import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../App";
import useAuth from "../hooks/useAuth";
import { appToast } from "../utils/utils";
import toast from "react-hot-toast";
import AppLoader from "../components/AppLoader";
import { useEventContext } from "../hooks/useEventContext";

interface LocationType {
  id: number | null;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface CreatedByType {
  id: number | null;
  name: string;
  email: string;
}
export interface EventType {
  id: number | null;
  title: string;
  date: string;
  category: string;
  location_id: LocationType;
  created_by: CreatedByType
  description: string;
}


const EventDetails: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {events} = useEventContext();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<EventType>({
    id: null,
    title: '',
    date: '',
    category: '',
    location_id: {
      id: null,
      name: '',
      address: '',
      city: '',
      state: '',
      country: ''
    },
    created_by: {
      id: null,
      name: '',
      email: ''
    },
    description: ''
  });

  useEffect(() => {
    console.log(id, 'id coming from previous page.');
    const fun = async () => {
      setIsLoading(true);
      try {
        const filteredEvent = events.find(el => el.id === +id!);
        setEventData(filteredEvent!);
        
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fun()
  }, [id])

  const handleRegister = async () => {
    setIsLoading(true);
    if (isAuthenticated) {
      try {
        const res = await axios({
          method: 'POST',
          url: `${BASE_URL}/events/${id}/register`,
          headers: {
            'authorization': `Bearer ${localStorage.getItem('auth-token')}`
          }
        })
        if (res.data.error) {
          toast.error(res.data.message || 'something went wrong! try again');
          return
        }
        toast.success(res.data.message)

      } catch (error) {
        console.log('catch block')
        toast.error('something went wrong! try again');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('You must be logged in to register for an event!');
      navigate('/signin');
    }
    setIsLoading(false);
  }

  console.log(id, eventData);

  return (
    <>
    {isLoading ? <AppLoader /> : <Container>
      <BackLink onClick={() => navigate(-1)} href="#">&larr; Back to Events</BackLink>
      <Title>{eventData?.title ?? ''}</Title>
      <InfoRow>
        <FaCalendarAlt /> {eventData?.date}
      </InfoRow>
      <InfoRow>
        <FaMapMarkerAlt /> {eventData?.location_id?.name}{eventData?.location_id?.address}{eventData?.location_id?.city}{eventData?.location_id?.state}{eventData?.location_id?.country}
      </InfoRow>
      <InfoRow>
        <FaUsers /> {eventData?.created_by?.name}
      </InfoRow>
      <Description>
        {eventData?.description}
      </Description>
      <RegisterButton onClick={handleRegister}>Register for Event</RegisterButton>
    </Container>}
    </>
  );
};



const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: white;
`;

const BackLink = styled.a`
  display: inline-block;
  margin-bottom: 10px;
  color: black;
  text-decoration: none;
  font-size: 16px;
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;
  font-size: 16px;
`;

const Description = styled.p`
  margin: 10px 0;
  font-size: 14px;
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #333;
  }
`;


export default EventDetails;