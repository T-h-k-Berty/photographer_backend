const express = require("express");
const router = express.Router();
const {
  createEvent,
  createMultipleEvents,
  getEventsByUser,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventScheduleController");

// Create single event
router.post("/", createEvent);

// Create multiple events at once
router.post("/bulk", createMultipleEvents);

// Get all events for a photographer
router.get("/user/:userId", getEventsByUser);

// Get single event by ID
router.get("/:id", getEventById);

// Update event by ID
router.put("/:id", updateEvent);

// Delete event by ID
router.delete("/:id", deleteEvent);

module.exports = router;
