const { EventSchedule, User } = require("../models");

// Save a single event
exports.createEvent = async (req, res) => {
  try {
    const { userId, name, place, date, start, end } = req.body;
    const event = await EventSchedule.create({ userId, name, place, date, start, end });
    res.status(201).json({ message: "Event created", event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save multiple events at once (array)
exports.createMultipleEvents = async (req, res) => {
  try {
    const { userId, events } = req.body; // events: [{name, place, date, start, end}, ...]
    if (!Array.isArray(events) || !userId) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const savedEvents = await Promise.all(
      events.map(event =>
        EventSchedule.create({ ...event, userId })
      )
    );
    res.status(201).json({ message: "Events created", events: savedEvents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View all events for a user (photographer)
exports.getEventsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const events = await EventSchedule.findAll({
      where: { userId },
      order: [["date", "ASC"], ["start", "ASC"]],
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await EventSchedule.findByPk(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit (update) an event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, place, date, start, end } = req.body;
    const event = await EventSchedule.findByPk(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.name = name || event.name;
    event.place = place || event.place;
    event.date = date || event.date;
    event.start = start || event.start;
    event.end = end || event.end;
    await event.save();

    res.json({ message: "Event updated", event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await EventSchedule.findByPk(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await event.destroy();
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
