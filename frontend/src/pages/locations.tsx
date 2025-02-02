import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CreateLocation from './CreateLocation';
import Navbar from './NavBar';
import axios from 'axios';
import { BASE_URL } from '../App';
import toast from 'react-hot-toast';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [isFlag, setIsFlag] = useState(false)

  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const fun = async () => {
      const res = await axios({
        method: 'get',
        url: `${BASE_URL}/location`,
        headers: {
          'Authorization': localStorage.getItem('auth-token')
        }
      })
      const data = res.data;
      if (data.error) {
        toast.error(data.message || 'something went wrong! try again');
        return;
      }
      console.log('data', data)
      setLocations(data.body);
    }
    fun()
  }, [isFlag])


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateLocation = async (newLocation: any) => {


    const res = await axios({
      method: 'post',
      url: `${BASE_URL}/location`,
      headers: {
        'Authorization': localStorage.getItem('auth-token')
      },
      data: {
        name: newLocation.name,
        address: newLocation.address,
        city: newLocation.city,
        state: newLocation.state,
        country: newLocation.country
      }
    })
    const data = res.data;
    if (data.error) {
      toast.error(data.message || 'something went wrong! try again');
      return;
    }
    console.log('data', data)

    setIsFlag(!isFlag)

    setCurrentLocation(null);

    setIsModalOpen(false);
  };



  return (
    <Container>

      <Navbar />
      <HeaderRow>

        <Header>Location List</Header>

        <CreateButton onClick={() => setIsModalOpen(true)}>Create Location</CreateButton>
      </HeaderRow>

      <CardGrid>
        {locations.map((location: any) => (
          <Card key={location.id}>
            <CardTitle>ID: {location.id}</CardTitle>
            <CardTitle>{location.name}</CardTitle>
            <CardDetail>{location.address}</CardDetail>
            <CardDetail>{location.city}, {location.state}</CardDetail>
            <CardDetail>{location.country}</CardDetail>
            <CardDetail>Created At: {new Date(location.created_at).toLocaleString()}</CardDetail>
          </Card>
        ))}
      </CardGrid>
      {isModalOpen && (
        <ModalBackdrop>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            <CreateLocation onSaveLocation={handleCreateLocation} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} currentLocation={currentLocation} />
          </ModalContent>
        </ModalBackdrop>
      )}
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

export default Locations;
