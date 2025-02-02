import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CreateEvent = ({ onSaveEvent, setIsModalOpen, isModalOpen, currentEvent }:any) => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
    location_id: ""
  });

  useEffect(() => {
    if (currentEvent) {
      setEventData(currentEvent);
    } else {
      setEventData({
        title: "",
        description: "",
        date: "",
        category: "",
        location_id: ""
      });
    }
  }, [currentEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedEvent = {
      ...eventData,
      id: currentEvent ? currentEvent.id : -1,
    };
    onSaveEvent(updatedEvent);
    setIsModalOpen(false);
  };


  const handleOverlayClick = (e : React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    isModalOpen && (
      <ModalOverlay onClick={handleOverlayClick}>
        <ModalContent>
          <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
          <Header>{currentEvent ? "Edit Event" : "Create New Event"}</Header>
          <Form onSubmit={handleSubmit}>
            <Input type="text" name="title" value={eventData.title} onChange={handleChange} placeholder="Event Title" required />
            <Input type="text" name="description" value={eventData.description} onChange={handleChange} placeholder="Description" required />
            <Input type="date" name="date" value={eventData.date} onChange={handleChange} required />
            <Input type="text" name="category" value={eventData.category} onChange={handleChange} placeholder="Category" required />
            <Input type="number" name="location_id" value={eventData.location_id} onChange={handleChange} placeholder="Location ID" required />
            <SubmitButton type="submit">{currentEvent ? "Save Changes" : "Create Event"}</SubmitButton>
          </Form>
        </ModalContent>
      </ModalOverlay>
    )
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

export default CreateEvent;
