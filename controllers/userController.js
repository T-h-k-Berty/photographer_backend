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
exports.updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const profilePicture = req.file ? req.file.path : null;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            user.password = password; // You can hash here if needed
        }
        if (profilePicture) {
            user.profilePicture = profilePicture;
        }

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};