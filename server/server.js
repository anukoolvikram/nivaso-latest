const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const authFedRoutes = require("./src/routes/authFedRoutes");
const authSocietyRoutes = require("./src/routes/authSocietyRoutes");
const flatDetailsRoutes = require("./src/routes/flatRoutes");
const authUserRoutes = require("./src/routes/authUserRoutes");

app.use('/temp', (req, res) => {
    res.send('Hello World');
});
app.use("/auth/federation", authFedRoutes);
app.use("/auth/society", authSocietyRoutes);
app.use("/flat", flatDetailsRoutes);
app.use("/user", authUserRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
