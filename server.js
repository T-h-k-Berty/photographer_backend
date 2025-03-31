const app = require("./index"); // Import the app instance from index.js
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
