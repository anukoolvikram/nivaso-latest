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
const authResidentRoutes = require("./src/routes/authResidentRoutes");
const blogRoutes=require("./src/routes/communityRoutes")
const noticeRoutes=require("./src/routes/noticeRoutes")
const complaintRoutes=require("./src/routes/complaintRoutes")

// app.use('/temp', (req, res) => {
//     res.send('Hello World');
// });
app.use("/auth/federation", authFedRoutes);
app.use("/auth/society", authSocietyRoutes);
app.use("/auth/resident", authResidentRoutes);
app.use('/blogs', blogRoutes)
app.use('/notices', noticeRoutes)
app.use('/complaints', complaintRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
