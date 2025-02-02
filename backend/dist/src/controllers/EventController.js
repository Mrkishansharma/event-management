"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const ormconfig_1 = require("../../ormconfig");
const Event_1 = require("../entities/Event");
const User_1 = require("../entities/User");
const Location_1 = require("../entities/Location");
const EventRegistration_1 = require("../entities/EventRegistration");
class EventController {
    // Create a new event
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { title, description, date, category, location_id } = req.body;
                const created_by = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.userAuthorization) === null || _b === void 0 ? void 0 : _b.id;
                // Check if user is admin
                const user = yield ormconfig_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: created_by });
                if (!user) {
                    return res.status(403).json({ error: true, message: "You do not have permission to create an event" });
                }
                // Check if location exists
                const location = yield ormconfig_1.AppDataSource.getRepository(Location_1.Location).findOneBy({ id: location_id });
                if (!location) {
                    return res.status(400).json({ error: true, message: "Location not found" });
                }
                // Create new event instance
                const eventRepository = ormconfig_1.AppDataSource.getRepository(Event_1.Event);
                const event = eventRepository.create({
                    title,
                    description,
                    date,
                    category,
                    location_id,
                    created_by,
                });
                // Save event to database
                yield eventRepository.save(event);
                // Return created event
                return res.status(201).json({
                    error: false,
                    message: 'event created succussfull',
                    body: event
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    error: true,
                    message: 'Internal Server Error'
                });
            }
        });
    }
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventRepository = ormconfig_1.AppDataSource.getRepository(Event_1.Event);
                // Extract query parameters
                const { date, category, location, page = 1, limit = 5 } = req.query;
                const take = limit || 5; // Items per page
                const skip = (Number(page) - 1) * take; // Calculate offset
                // Create query builder
                const queryBuilder = eventRepository.createQueryBuilder("event")
                    .leftJoinAndSelect("event.location_id", "location") // Join location table
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
                    queryBuilder.andWhere(`(location.name ILIKE :location OR 
                  location.address ILIKE :location OR 
                  location.city ILIKE :location OR 
                  location.state ILIKE :location OR 
                  location.country ILIKE :location)`, { location: `%${location}%` } // Partial match using wildcard
                    );
                }
                // Apply pagination
                queryBuilder.skip(skip).take(take);
                // Execute query
                const [events, total] = yield queryBuilder.getManyAndCount();
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
            }
            catch (error) {
                console.error("Error fetching events get Events:", error);
                return res.status(500).json({ error: true, message: "Failed to fetch events", body: [] });
            }
        });
    }
    // Get event by id
    getEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('GET EVENT BY ID API CALL');
            try {
                const { id } = req.params;
                const eventRepository = ormconfig_1.AppDataSource.getRepository(Event_1.Event);
                const events = yield eventRepository.find({
                    where: { id: parseInt(id) },
                    relations: ["location_id", "created_by"],
                });
                return res.status(200).json({
                    error: false,
                    message: "",
                    body: events
                });
            }
            catch (error) {
                console.error("Error fetching events getEvent By Id:", error);
                return res.status(500).json({ error: true, message: "Failed to fetch event", body: [] });
            }
        });
    }
    // Update an event
    updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { id } = req.params;
                const { title, description, date, category, location_id } = req.body;
                const created_by = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.userAuthorization) === null || _b === void 0 ? void 0 : _b.id;
                const eventRepository = ormconfig_1.AppDataSource.getRepository(Event_1.Event);
                const event = yield eventRepository.findOneBy({ id: parseInt(id) });
                if (!event) {
                    return res.status(404).json({ message: "Event not found" });
                }
                // Check if location and user exist
                const location = yield ormconfig_1.AppDataSource.getRepository(Location_1.Location).findOneBy({ id: location_id });
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
                yield eventRepository.save(event);
                return res.status(200).json({
                    error: false,
                    message: "update succussfull",
                    body: event
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    error: false,
                    message: "Something went wrong"
                });
            }
        });
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
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const eventId = parseInt(id);
                const eventRepository = ormconfig_1.AppDataSource.getRepository(Event_1.Event);
                const registrationRepository = ormconfig_1.AppDataSource.getRepository(EventRegistration_1.EventRegistration);
                // Check if the event exists
                const event = yield eventRepository.findOneBy({ id: eventId });
                if (!event) {
                    return res.status(404).json({ error: true, message: "Event not found" });
                }
                // Delete related event registrations first
                yield registrationRepository.delete({ event: { id: eventId } });
                // Now delete the event
                yield eventRepository.delete(eventId);
                return res.status(200).json({ error: false, message: "Event deleted successfully" });
            }
            catch (error) {
                console.error("Error deleting event:", error);
                return res.status(500).json({ error: true, message: error.message || "Something went wrong" });
            }
        });
    }
}
exports.EventController = EventController;
