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
exports.LocationController = void 0;
const ormconfig_1 = require("../../ormconfig"); // Adjust path if necessary
const Location_1 = require("../entities/Location"); // Adjust path if necessary
class LocationController {
    // Create a new location
    createLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, address, city, state, country } = req.body;
            try {
                // Check if location already exists
                const existingLocation = yield ormconfig_1.AppDataSource.getRepository(Location_1.Location).findOneBy({ name });
                if (existingLocation) {
                    return res.status(409).json({ error: true, message: "Location already exists" });
                }
                // Create a new location instance
                const locationRepository = ormconfig_1.AppDataSource.getRepository(Location_1.Location);
                const location = locationRepository.create({
                    name,
                    address,
                    city,
                    state,
                    country,
                });
                // Save location to database
                yield locationRepository.save(location);
                // Return the created location
                return res.status(201).json({
                    error: false,
                    message: "Location created successfully",
                    body: location
                });
            }
            catch (error) {
                console.error("Error creating location:", error);
                return res.status(500).json({ error: true, message: "Failed to create location" });
            }
        });
    }
    // Get all locations
    getLocations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locationRepository = ormconfig_1.AppDataSource.getRepository(Location_1.Location);
                const locations = yield locationRepository.find();
                return res.status(200).json({
                    error: false,
                    message: "",
                    body: locations
                });
            }
            catch (error) {
                console.error("Error fetching locations:", error);
                return res.status(500).json({ error: true, message: "Failed to fetch locations" });
            }
        });
    }
    // Update an existing location
    updateLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, address, city, state, country } = req.body;
            try {
                const locationRepository = ormconfig_1.AppDataSource.getRepository(Location_1.Location);
                const location = yield locationRepository.findOneBy({ id: parseInt(id) });
                if (!location) {
                    return res.status(404).json({ error: true, message: "Location not found" });
                }
                // Update location properties
                location.name = name || location.name;
                location.address = address || location.address;
                location.city = city || location.city;
                location.state = state || location.state;
                location.country = country || location.country;
                // Save updated location
                yield locationRepository.save(location);
                return res.status(200).json({
                    error: false,
                    message: "Location updated successfully",
                    body: location
                });
            }
            catch (error) {
                console.error("Error updating location:", error);
                return res.status(500).json({ error: true, message: "Failed to update location" });
            }
        });
    }
    // Delete a location
    deleteLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log('id', id);
            try {
                const locationRepository = ormconfig_1.AppDataSource.getRepository(Location_1.Location);
                const location = yield locationRepository.findOneBy({ id: parseInt(id) });
                if (!location) {
                    return res.status(404).json({ error: true, message: "Location not found" });
                }
                // Remove location from the database
                yield locationRepository.remove(location);
                return res.status(200).json({ error: false, message: "Location deleted successfully" });
            }
            catch (error) {
                console.error("Error deleting location:", error);
                return res.status(500).json({ error: true, message: "Failed to delete location" });
            }
        });
    }
}
exports.LocationController = LocationController;
