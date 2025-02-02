import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CreateLocation = ({ onSaveLocation  , setIsModalOpen, isModalOpen, currentLocation } : any) => {
  const [locationData, setLocationData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
  });

  // Fill form with existing location data when editing
  useEffect(() => {
    if (currentLocation) {
      setLocationData(currentLocation);
    } else {
      setLocationData({ name: '', address: '', city: '', state: '', country: '' });
    }
  }, [currentLocation]);

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocationData({ ...locationData, [name]: value });
  };

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedLocation = {
      ...locationData,
      id: currentLocation ? currentLocation.id : Date.now(),
      created_at: currentLocation ? currentLocation.created_at : new Date().toISOString(),
    };
    onSaveLocation(updatedLocation);
    setIsModalOpen(false); // Close modal after saving
  };

  return (
    <>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            <Header>{currentLocation ? "Edit Location" : "Create New Location"}</Header>
            <Form onSubmit={handleSubmit}>
              <Input type="text" name="name" value={locationData.name} onChange={handleChange} placeholder="Location Name" required />
              <Input type="text" name="address" value={locationData.address} onChange={handleChange} placeholder="Address" required />
              <Input type="text" name="city" value={locationData.city} onChange={handleChange} placeholder="City" required />
              <Input type="text" name="state" value={locationData.state} onChange={handleChange} placeholder="State" required />
              <Input type="text" name="country" value={locationData.country} onChange={handleChange} placeholder="Country" required />
              <SubmitButton type="submit">{currentLocation ? "Save Changes" : "Create Location"}</SubmitButton>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  position: relative;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Header = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

export default CreateLocation;
