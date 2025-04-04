const User = require("../models/userModel");

exports.getAllPhotographers = async (req, res) => {
    try {
        const photographers = await User.findAll({ where: { role: "photographer" } });
        res.json(photographers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.ratePhotographer = async (req, res) => {
    try {
        const { photographerId } = req.params;
        const { rating } = req.body;

        const photographer = await User.findByPk(photographerId);
        if (!photographer || photographer.role !== "photographer") {
            return res.status(404).json({ message: "Photographer not found" });
        }

        const newRatingCount = photographer.ratingCount + 1;
        const newRating = (photographer.rating * photographer.ratingCount + rating) / newRatingCount;

        photographer.rating = newRating;
        photographer.ratingCount = newRatingCount;
        await photographer.save();

        res.json({ message: "Rating submitted", rating: newRating, ratingCount: newRatingCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
