const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const bookingController = require("../controllers/bookingController");

// Client creates a booking
router.post("/", auth, bookingController.createBooking);

// Client gets their bookings
router.get("/client", auth, bookingController.getClientBookings);
router.get("/client/:clientId", bookingController.getBookingsByClientId);

// Photographer gets their bookings
router.get("/photographer", auth, bookingController.getPhotographerBookings);

// Photographer accepts a booking
router.put("/accept/:bookingId", auth, bookingController.acceptBooking);

// Photographer cancels a booking
router.put("/cancel/:bookingId", auth, bookingController.cancelBooking);

// Get a single booking (for details)
router.get("/:id", auth, bookingController.getBookingById);

module.exports = router;