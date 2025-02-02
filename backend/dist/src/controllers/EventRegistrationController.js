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
exports.EventRegistrationController = void 0;
const ormconfig_1 = require("../../ormconfig");
const Event_1 = require("../entities/Event");
const User_1 = require("../entities/User");
const EventRegistration_1 = require("../entities/EventRegistration");
class EventRegistrationController {
    registerForEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { id } = req.params;
            const eventId = parseInt(id);
            const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.userAuthorization) === null || _b === void 0 ? void 0 : _b.id;
            try {
                const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
                const eventRepository = ormconfig_1.AppDataSource.getRepository(Event_1.Event);
                const registrationRepository = ormconfig_1.AppDataSource.getRepository(EventRegistration_1.EventRegistration);
                const user = yield userRepository.findOneBy({ id: userId });
                if (!user) {
                    return res.status(404).json({ error: true, message: "User not found" });
                }
                const event = yield eventRepository.findOneBy({ id: eventId });
                if (!event) {
                    return res.status(404).json({ error: true, message: "Event not found" });
                }
                // Check if user is already registered for the event
                // Check if a registration already exists
                const existingRegistration = yield registrationRepository.findOne({
                    where: { user: { id: userId }, event: { id: eventId } }
                });
                if (existingRegistration) {
                    if (existingRegistration.status === "registered") {
                        return res.status(400).json({ error: false, message: "User is already registered for this event" });
                    }
                    else if (existingRegistration.status === "cancelled") {
                        // If previously cancelled, update status to 'registered'
                        existingRegistration.status = "registered";
                        yield registrationRepository.save(existingRegistration);
                        return res.status(200).json({ error: false, message: "User re-registered for the event" });
                    }
                }
                console.log("registrationRepository", registrationRepository);
                // Create registration
                const registration = registrationRepository.create({
                    user_id: user.id, // The whole user object (not user_id)
                    event_id: event.id, // The whole event object (not event_id)
                    status: "registered", // Correct status (use enum value)
                });
                yield registrationRepository.save(registration);
                return res.status(201).json({ erro: false, message: "User registered for event" });
            }
            catch (error) {
                console.error("Error registering user:", error);
                return res.status(500).json({ error: true, message: "Failed to register user for event" });
            }
        });
    }
    getAllEventRegistrations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.userAuthorization) === null || _b === void 0 ? void 0 : _b.id;
                // Fetch all registrations with related user and event data
                const eventRegistrationRepository = ormconfig_1.AppDataSource.getRepository(EventRegistration_1.EventRegistration);
                const registrations = yield eventRegistrationRepository.find({
                    where: { user_id: userId },
                    relations: ["user", "event"], // Include related entities like user and event
                });
                // Return the list of registrations
                return res.status(200).json({
                    error: false,
                    message: "",
                    body: registrations
                });
            }
            catch (error) {
                console.error("Error fetching event registrations:", error);
                return res.status(500).json({ error: true, message: "Failed to fetch event registrations" });
            }
        });
    }
    getAllAdminEventRegistrations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.userAuthorization) === null || _b === void 0 ? void 0 : _b.id;
                // Fetch all registrations with related user and event data
                const eventRegistrationRepository = ormconfig_1.AppDataSource.getRepository(EventRegistration_1.EventRegistration);
                const registrations = yield eventRegistrationRepository.find({
                    relations: ["user", "event"], // Include related entities like user and event
                });
                // Return the list of registrations
                return res.status(200).json({
                    error: false,
                    message: "",
                    body: registrations
                });
            }
            catch (error) {
                console.error("Error fetching event registrations:", error);
                return res.status(500).json({ error: true, message: "Failed to fetch event registrations" });
            }
        });
    }
    cancelRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { id } = req.params;
            const eventId = parseInt(id);
            const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.userAuthorization) === null || _b === void 0 ? void 0 : _b.id;
            try {
                const registrationRepository = ormconfig_1.AppDataSource.getRepository(EventRegistration_1.EventRegistration);
                const registration = yield registrationRepository.findOne({
                    where: { user_id: userId, event_id: eventId }
                });
                if (!registration) {
                    return res.status(404).json({ message: "Registration not found" });
                }
                // Update status to 'cancelled'
                registration.status = "cancelled";
                yield registrationRepository.save(registration);
                return res.status(200).json({ error: false, message: "Registration cancelled", registration });
            }
            catch (error) {
                console.error("Error cancelling registration:", error);
                return res.status(500).json({ error: true, message: "Failed to cancel registration" });
            }
        });
    }
}
exports.EventRegistrationController = EventRegistrationController;
