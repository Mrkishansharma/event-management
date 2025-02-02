import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig";
import { Event } from "../entities/Event";
import { User } from "../entities/User";
import { Location } from "../entities/Location";
import { EventRegistration } from "../entities/EventRegistration";

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



  async getEvents(req: Request, res: Response): Promise<any> {
    try {
      const eventRepository = AppDataSource.getRepository(Event);

      // Extract query parameters
      const { date, category, location, page = 1, limit = 5 } = req.query;
      const take: any = limit || 5; // Items per page
      const skip = (Number(page) - 1) * take; // Calculate offset

      // Create query builder
      const queryBuilder = eventRepository.createQueryBuilder("event")
        .leftJoinAndSelect("event.location_id", "location")  // Join location table
        .leftJoinAndSelect("event.created_by", "creator");

      // Apply filters if provided
      if (date) {
        queryBuilder.andWhere("DATE(event.date) = :date", { date });
      }
      if (category) {
        queryBuilder.andWhere("event.category = :category", { category });
      }
      if (location) {
        // Search in multiple location fields using ILIKE (case-insensitive search)
        queryBuilder.andWhere(
          `(location.name ILIKE :location OR 
                  location.address ILIKE :location OR 
                  location.city ILIKE :location OR 
                  location.state ILIKE :location OR 
                  location.country ILIKE :location)`,
          { location: `%${location}%` } // Partial match using wildcard
        );
      }

      // Apply pagination
      queryBuilder.skip(skip).take(take);

      // Execute query
      const [events, total] = await queryBuilder.getManyAndCount();

      return res.status(200).json({
        error: false,
        message: "",
        body: {
          events,
          total,
          page: Number(page),
          totalPages: Math.ceil(total / take),
        }
      });

    } catch (error) {
      console.error("Error fetching events get Events:", error);
      return res.status(500).json({ error: true, message: "Failed to fetch events", body: [] });
    }
  }


  // Get event by id
  async getEventById(req: Request, res: Response): Promise<any> {
    console.log('GET EVENT BY ID API CALL')
    try {
      const { id } = req.params;
      const eventRepository = AppDataSource.getRepository(Event);
      const events = await eventRepository.find({
        where: { id: parseInt(id) },
        relations: ["location_id", "created_by"],
      });

      return res.status(200).json({
        error: false,
        message: "",
        body: events
      });
    } catch (error) {
      console.error("Error fetching events getEvent By Id:", error);
      return res.status(500).json({ error: true, message: "Failed to fetch event", body: [] });
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
      event.id = parseInt(id);
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
  // async deleteEvent(req: Request, res: Response): Promise<any> {
  //   try {
  //     const { id } = req.params;
  //     const eventRepository = AppDataSource.getRepository(Event);

  //     const event = await eventRepository.findOneBy({ id: parseInt(id) });

  //     if (!event) {
  //       return res.status(404).json({ message: "Event not found" });
  //     }

  //     // Delete event
  //     await eventRepository.remove(event);

  //     return res.status(200).json({ error: false, message: "Event deleted successfully" });

  //   } catch (error: any) {
  //     return res.status(500).json({ error: true, message: error.message || "Something Went Wrong" });

  //   }
  // }

  async deleteEvent(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const eventId = parseInt(id);

      const eventRepository = AppDataSource.getRepository(Event);
      const registrationRepository = AppDataSource.getRepository(EventRegistration);

      // Check if the event exists
      const event = await eventRepository.findOneBy({ id: eventId });
      if (!event) {
        return res.status(404).json({ error: true, message: "Event not found" });
      }

      // Delete related event registrations first
      await registrationRepository.delete({ event: { id: eventId } });

      // Now delete the event
      await eventRepository.delete(eventId);

      return res.status(200).json({ error: false, message: "Event deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting event:", error);
      return res.status(500).json({ error: true, message: error.message || "Something went wrong" });
    }
  }

}
