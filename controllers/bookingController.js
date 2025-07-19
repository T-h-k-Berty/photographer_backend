// controllers/bookingController.js
const { Booking, User, Notification, Portfolio, EventSchedule } = require("../models");

// 1. Create a booking (client creates booking)
exports.createBooking = async (req, res) => {
  try {
    const { photographerId, name, address, date, time, eventType, description, phone } = req.body;
    const clientId = req.user.id;

    const booking = await Booking.create({
      clientId,
      photographerId,
      name,
      address,
      date,
      time,
      eventType,
      description,
      phone,
      status: "pending"
    });

    // Notify photographer (ALWAYS include bookingId)
    await Notification.create({
      userId: photographerId,
      message: `You have a new booking from ${name} on ${date} at ${time}.`,
      type: "booking",
      isRead: false,
      bookingId: booking.id,
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get all bookings for the logged-in client (my bookings)
exports.getClientBookings = async (req, res) => {
  try {
    const clientId = req.user.id;
    const bookings = await Booking.findAll({
      where: { clientId },
      include: [
        { model: User, as: "Photographer", attributes: ["id", "name", "email", "profilePicture"] },
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get all bookings for the logged-in photographer (my received bookings)
exports.getMyPhotographerBookings = async (req, res) => {
  try {
    const photographerId = req.user.id;
    const bookings = await Booking.findAll({
      where: { photographerId },
      include: [
        { model: User, as: "Client", attributes: ["id", "name", "email", "profilePicture"] },
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3b. (Admin use, or if you need to fetch by *any* photographer id)
exports.getPhotographerBookingsById = async (req, res) => {
  try {
    const { photographerId } = req.params;
    const bookings = await Booking.findAll({
      where: { photographerId },
      include: [
        { model: User, as: "Client", attributes: ["id", "name", "email", "profilePicture"] },
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Photographer accepts a booking
exports.acceptBooking = async (req, res) => {
  try {
    const photographerId = req.user.id;
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ where: { id: bookingId, photographerId } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only accept if not already accepted or canceled
    if (booking.status === "accepted") {
      return res.status(400).json({ message: "Booking already accepted." });
    }
    if (booking.status === "canceled") {
      return res.status(400).json({ message: "Booking already canceled." });
    }

    booking.status = "accepted";
    await booking.save();

    // 1. Create EventSchedule entry (if not already present)
    const existingEvent = await EventSchedule.findOne({
      where: {
        userId: photographerId,
        name: booking.eventType,
        place: booking.address,
        date: booking.date,
        start: booking.time,
      }
    });
    if (!existingEvent) {
      // Add logging to see exactly what is being created
      console.log("Creating EventSchedule:", {
        userId: photographerId,
        name: booking.eventType,
        place: booking.address,
        date: booking.date,
        start: booking.time,
        end: booking.time
      });

      await EventSchedule.create({
        userId: photographerId,
        name: booking.eventType,
        place: booking.address,
        date: booking.date,
        start: booking.time,
        end: booking.time, // If you add end time to booking, use it here
      });
    }

    // 2. Notify client
    await Notification.create({
      userId: booking.clientId,
      message: `Your booking with the photographer has been ACCEPTED for ${booking.date} at ${booking.time}.`,
      type: "status",
      isRead: false,
      bookingId: booking.id,
    });

    res.json({ message: "Booking accepted, and schedule updated!", booking });
  } catch (err) {
    console.error("ACCEPT_BOOKING ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 5. Photographer cancels a booking
exports.cancelBooking = async (req, res) => {
  try {
    const photographerId = req.user.id;
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ where: { id: bookingId, photographerId } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "canceled";
    await booking.save();

    // Notify client (ALWAYS include bookingId)
    await Notification.create({
      userId: booking.clientId,
      message: `Your booking with the photographer has been CANCELED for ${booking.date} at ${booking.time}.`,
      type: "status",
      isRead: false,
      bookingId: booking.id,
    });

    res.json({ message: "Booking canceled", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get a single booking by ID (for either client or photographer)
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [
        { model: User, as: "Client", attributes: ["id", "name", "email", "profilePicture"] },
        { model: User, as: "Photographer", attributes: ["id", "name", "email", "profilePicture"] }
      ]
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Admin or authorized: get all bookings by a clientId (for user management, not needed for most apps)
exports.getBookingsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    const bookings = await Booking.findAll({
      where: { clientId },
      include: [
        {
          model: User,
          as: "Photographer",
          attributes: ["id", "name", "email", "profilePicture"],
          include: [
            {
              model: Portfolio,
              as: "Portfolio",
              attributes: ["shopName", "photographerName"]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
