import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig"; // Adjust path if necessary
import { Location } from "../entities/Location"; // Adjust path if necessary
import { error } from "console";

export class LocationController {
  // Create a new location
  async createLocation(req: Request, res: Response): Promise<any> {
    const { name, address, city, state, country } = req.body;

    try {
      // Check if location already exists
      const existingLocation = await AppDataSource.getRepository(Location).findOneBy({ name });
      if (existingLocation) {
        return res.status(409).json({ error: true, message: "Location already exists" });
      }

      // Create a new location instance
      const locationRepository = AppDataSource.getRepository(Location);
      const location = locationRepository.create({
        name,
        address,
        city,
        state,
        country,
      });

      // Save location to database
      await locationRepository.save(location);

      // Return the created location
      return res.status(201).json({
        error: false,
        message: "Location created successfully",
        body: location
      });
    } catch (error) {
      console.error("Error creating location:", error);
      return res.status(500).json({ error: true, message: "Failed to create location" });
    }
  }

  // Get all locations
  async getLocations(req: Request, res: Response): Promise<any> {
    try {
      const locationRepository = AppDataSource.getRepository(Location);
      const locations = await locationRepository.find();

      return res.status(200).json({
        error: false,
        message: "",
        body: locations
      });
    } catch (error) {
      console.error("Error fetching locations:", error);
      return res.status(500).json({ error: true, message: "Failed to fetch locations" });
    }
  }

  // Update an existing location
  async updateLocation(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const { name, address, city, state, country } = req.body;

    try {
      const locationRepository = AppDataSource.getRepository(Location);
      const location = await locationRepository.findOneBy({ id: parseInt(id) });

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
      await locationRepository.save(location);

      return res.status(200).json({
        error: false,
        message: "Location updated successfully",
        body: location
      });
    } catch (error) {
      console.error("Error updating location:", error);
      return res.status(500).json({ error: true, message: "Failed to update location" });
    }
  }

  // Delete a location
  async deleteLocation(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    console.log('id', id)
    try {
      const locationRepository = AppDataSource.getRepository(Location);
      const location = await locationRepository.findOneBy({ id: parseInt(id) });

      if (!location) {
        return res.status(404).json({ error: true, message: "Location not found" });
      }

      // Remove location from the database
      await locationRepository.remove(location);

      return res.status(200).json({ error: false, message: "Location deleted successfully" });
    } catch (error) {
      console.error("Error deleting location:", error);
      return res.status(500).json({ error: true, message: "Failed to delete location" });
    }
  }
}
