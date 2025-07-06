const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const bookingController = require("../controllers/bookingController");

// =================== CLIENT ROUTES ===================

// Create a booking (client)
router.post("/", auth, bookingController.createBooking);

// Get all bookings for the logged-in client (my bookings)
router.get("/client", auth, bookingController.getClientBookings);

// [Admin/analytics] Get all bookings by a given clientId
router.get("/client/:clientId", auth, bookingController.getBookingsByClientId);

// =================== PHOTOGRAPHER ROUTES ===================

// Get all bookings for the logged-in photographer (my received bookings)
router.get("/photographer", auth, bookingController.getMyPhotographerBookings);

// [Admin/analytics] Get all bookings for any photographer by ID (optional)
// If you don't want this, just remove it.
router.get("/photographer/:photographerId", auth, bookingController.getPhotographerBookingsById);

// Photographer accepts a booking
router.put("/accept/:bookingId", auth, bookingController.acceptBooking);

// Photographer cancels a booking
router.put("/cancel/:bookingId", auth, bookingController.cancelBooking);

// =================== GENERAL ROUTES ===================

// Get a single booking by ID (for details)
router.get("/:id", auth, bookingController.getBookingById);

module.exports = router;
