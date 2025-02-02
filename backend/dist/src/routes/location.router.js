"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LocationController_1 = require("../controllers/LocationController");
const adminAuthMiddleware_1 = require("../middleware/adminAuthMiddleware");
const router = (0, express_1.Router)();
const locationController = new LocationController_1.LocationController();
router.post("/", adminAuthMiddleware_1.adminAuthenticated, locationController.createLocation);
router.get("/", adminAuthMiddleware_1.adminAuthenticated, locationController.getLocations);
router.delete("/:id", adminAuthMiddleware_1.adminAuthenticated, locationController.deleteLocation);
router.put("/:id", adminAuthMiddleware_1.adminAuthenticated, locationController.updateLocation);
exports.default = router;
