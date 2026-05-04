// import mongoose from "mongoose";
import events from "../models/events.js";
import Events from "../models/events.js";
import User from "../models/user.js";
// import Events from "../routes/events.js";



export async function getAllEvents(req, res) {
    try {
        const filters = {};
        if (req.query.category) {
            filters.category = req.query.category;
        }
        if (req.query.ticketPrice) {
            filters.ticketPrice = req.query.ticketPrice;
        }

        const events = await Events.find(filters);
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json(
            error,
            { message: "error is in Event fetching..." })
    }
}
export async function getEventById(req, res) {
    const { id } = req.body;
    try {
        const eventFromDB = await Events.findById(id);
        if (!eventFromDB) {
            return res.status(404).json({ message: "No event is found by this ID." })
        }
        return res.status(200).json(eventFromDB);
    }
    catch (err) {
        return res.status(500).json(err);
    }
}
export async function createEvent(req, res) {
    const { title, description, date, location, category, totalSeats, ticketPrice, date, imageUrl } = req.body;
    try {
        const event = await events.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats: totalSeats,
            ticketPrice: ticketPrice || 0,
            image: image || '',
            createdBy: req.user.id
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};