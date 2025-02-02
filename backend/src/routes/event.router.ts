import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { isAuthenticated } from "../middleware/authMiddleware";
import { adminAuthenticated } from "../middleware/adminAuthMiddleware";
import { EventRegistrationController } from "../controllers/EventRegistrationController";

const router = Router();
const eventController = new EventController();

const eventRegistrationController = new EventRegistrationController();



router.get("/", eventController.getEvents);
router.post("/", adminAuthenticated, eventController.createEvent);
router.put("/:id",  adminAuthenticated, eventController.updateEvent);
router.delete("/:id", adminAuthenticated, eventController.deleteEvent);

router.post("/:id/register", isAuthenticated, eventRegistrationController.registerForEvent);
router.get("/registrations", isAuthenticated, eventRegistrationController.getAllEventRegistrations)
router.get("/admin/registrations", adminAuthenticated, eventRegistrationController.getAllAdminEventRegistrations)
router.post("/:id/cancel", isAuthenticated, eventRegistrationController.cancelRegistration)

export default router;