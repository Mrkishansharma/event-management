import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig";
import { Event } from "../entities/Event";
import { User } from "../entities/User";
import { Location } from "../entities/Location";

export class EventController {

  // Create a new event
  async createEvent(req: Request, res: Response): Promise<any> {
    try {

      const { title, description, date, category, location_id } = req.body;

      const created_by = req?.body?.userAuthorization?.id;

      // Check if user is admin
      const user = await AppDataSource.getRepository(User).findOneBy({ id: created_by });
      if (!user) {
        return res.status(403).json({ error: true, message: "You do not have permission to create an event" });
      }

      // Check if location exists
      const location = await AppDataSource.getRepository(Location).findOneBy({ id: location_id });
      if (!location) {
        return res.status(400).json({ error: true, message: "Location not found" });
      }

      // Create new event instance
      const eventRepository = AppDataSource.getRepository(Event);
      const event = eventRepository.create({
        title,
        description,
        date,
        category,
        location_id,
        created_by,
      });

      // Save event to database
      await eventRepository.save(event);

      // Return created event
      return res.status(201).json({
        error: false,
        message: 'event created succussfull',
        body: event
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Internal Server Error'
      });
    }
  }

  // Get all events
  async getEvents(req: Request, res: Response): Promise<any> {
    try {
      const eventRepository = AppDataSource.getRepository(Event);
      const events = await eventRepository.find({
        relations: ["location_id", "created_by"], 
      });

      return res.status(200).json({
        error: false,
        message: "",
        body: events
      }); 
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(500).json({ error: true, message: "Failed to fetch events", body: [] });
    }
  }

  // Update an event
  async updateEvent(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { title, description, date, category, location_id } = req.body;
      const created_by = req?.body?.userAuthorization?.id;

      const eventRepository = AppDataSource.getRepository(Event);
      const event = await eventRepository.findOneBy({ id: parseInt(id) });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if location and user exist
      const location = await AppDataSource.getRepository(Location).findOneBy({ id: location_id });

      if (!location) {
        return res.status(400).json({ message: "Location not found" });
      }

      // Update event fields
      event.title = title || event.title;
      event.description = description || event.description;
      event.date = date || event.date;
      event.category = category || event.category;
      event.location_id = location_id;
      event.created_by = created_by;

      // Save updated event
      await eventRepository.save(event);

      return res.status(200).json({
        error: false,
        message: "update succussfull",
        body: event
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: false,
        message: "Something went wrong"
      });

    }
  }

  // Delete an event
  async deleteEvent(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const eventRepository = AppDataSource.getRepository(Event);

      const event = await eventRepository.findOneBy({ id: parseInt(id) });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Delete event
      await eventRepository.remove(event);

      return res.status(200).json({ error: false, message: "Event deleted successfully" });

    } catch (error) {
      return res.status(500).json({ error: true, message: "Event deleted successfully" });

    }
  }
}
