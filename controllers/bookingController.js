const { Booking, User, Notification, Portfolio } = require("../models");

// ========== 1. Client creates a booking ==========
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

// ========== 2. All bookings by this client (client sees their own bookings) ==========
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

// ========== 3. All bookings for logged-in photographer ==========
exports.getPhotographerBookings = async (req, res) => {
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

// ========== 4. Photographer accepts a booking ==========
exports.acceptBooking = async (req, res) => {
  try {
    const photographerId = req.user.id;
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ where: { id: bookingId, photographerId } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "accepted";
    await booking.save();

    // Notify client (ALWAYS include bookingId)
    await Notification.create({
      userId: booking.clientId,
      message: `Your booking with the photographer has been ACCEPTED for ${booking.date} at ${booking.time}.`,
      type: "status",
      isRead: false,
      bookingId: booking.id,
    });

    res.json({ message: "Booking accepted", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== 5. Photographer cancels a booking ==========
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

// ========== 6. Get a single booking by ID (for either client or photographer) ==========
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

// ========== 7. Admin or authorized: get all bookings by a clientId ==========
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
