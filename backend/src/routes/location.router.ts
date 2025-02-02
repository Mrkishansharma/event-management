import { Router } from "express";
import { LocationController } from "../controllers/LocationController";
import { isAuthenticated } from "../middleware/authMiddleware";
import { adminAuthenticated } from "../middleware/adminAuthMiddleware";

const router = Router();
const locationController = new LocationController();


router.post("/", adminAuthenticated, locationController.createLocation);
router.get("/", adminAuthenticated, locationController.getLocations);
router.delete("/:id", adminAuthenticated, locationController.deleteLocation)
router.put("/:id", adminAuthenticated, locationController.updateLocation)
export default router;