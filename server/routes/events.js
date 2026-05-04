import { Router } from "express";
import { protect, admin } from "../middleware/auth.js";
import { getAllEvents, getEventById, createEvent, deleteEvent, updateEvent } from "../controller/eventController.js"
const router = Router();

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post("/", protect, admin, createEvent);

router.delete("/:id", protect, admin, deleteEvent);

router.put("/:id", protect, admin, updateEvent);

export default router;