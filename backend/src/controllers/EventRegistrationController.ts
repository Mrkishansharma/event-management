import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig";
import { Event } from "../entities/Event";
import { User } from "../entities/User";
import { Location } from "../entities/Location";
import { EventRegistration } from "../entities/EventRegistration";



export class EventRegistrationController {
  async registerForEvent(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const eventId = parseInt(id)
    const userId = req?.body?.userAuthorization?.id;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const eventRepository = AppDataSource.getRepository(Event);
      const registrationRepository = AppDataSource.getRepository(EventRegistration);

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      const event = await eventRepository.findOneBy({ id: eventId });
      if (!event) {
        return res.status(404).json({ error: true, message: "Event not found" });
      }

      // Check if user is already registered for the event
      // Check if a registration already exists
      const existingRegistration = await registrationRepository.findOne({
        where: { user: { id: userId }, event: { id: eventId } }
      });

      if (existingRegistration) {
        if (existingRegistration.status === "registered") {
          return res.status(400).json({ error: false, message: "User is already registered for this event" });
        } else if (existingRegistration.status === "cancelled") {
          // If previously cancelled, update status to 'registered'
          existingRegistration.status = "registered";
          await registrationRepository.save(existingRegistration);
          return res.status(200).json({ error: false, message: "User re-registered for the event" });
        }
      }
      console.log("registrationRepository", registrationRepository)

      // Create registration
      const registration = registrationRepository.create({
        user_id: user.id,          // The whole user object (not user_id)
        event_id: event.id,        // The whole event object (not event_id)
        status: "registered", // Correct status (use enum value)
      });

      await registrationRepository.save(registration);

      return res.status(201).json({ erro: false, message: "User registered for event" });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ error: true, message: "Failed to register user for event" });
    }
  }
  async getAllEventRegistrations(req: Request, res: Response): Promise<any> {
    try {
      const userId = req?.body?.userAuthorization?.id;
      // Fetch all registrations with related user and event data
      const eventRegistrationRepository = AppDataSource.getRepository(EventRegistration);
      const registrations = await eventRegistrationRepository.find({
        where: { user_id: userId },
        relations: ["user", "event"], // Include related entities like user and event
      });

      // Return the list of registrations
      return res.status(200).json({
        error: false,
        message: "",
        body: registrations
      });
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      return res.status(500).json({ error: true, message: "Failed to fetch event registrations" });
    }
  }

  async getAllAdminEventRegistrations(req: Request, res: Response): Promise<any> {
    try {
      const userId = req?.body?.userAuthorization?.id;
      // Fetch all registrations with related user and event data
      const eventRegistrationRepository = AppDataSource.getRepository(EventRegistration);
      const registrations = await eventRegistrationRepository.find({
        relations: ["user", "event"], // Include related entities like user and event
      });

      // Return the list of registrations
      return res.status(200).json({
        error: false,
        message: "",
        body: registrations
      });
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      return res.status(500).json({ error: true, message: "Failed to fetch event registrations" });
    }
  }
  async cancelRegistration(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const eventId = parseInt(id)
    const userId = req?.body?.userAuthorization?.id;

    try {
      const registrationRepository = AppDataSource.getRepository(EventRegistration);

      const registration = await registrationRepository.findOne({
        where: { user_id: userId, event_id: eventId }
      });

      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      // Update status to 'cancelled'
      registration.status = "cancelled";
      await registrationRepository.save(registration);

      return res.status(200).json({ error: false, message: "Registration cancelled", registration });
    } catch (error) {
      console.error("Error cancelling registration:", error);
      return res.status(500).json({ error: true, message: "Failed to cancel registration" });
    }
  }

}