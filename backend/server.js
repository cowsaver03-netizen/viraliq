const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const blogRoutes = require('./routes/blog.Routes');
const testimonialsRoutes = require('./routes/testimonials.Routes');
const teamRoutes = require('./routes/team.Routes');
const socialRoutes = require('./routes/social.Routes');
const contactRoutes = require('./routes/contact.Routes');
const pricingRoutes = require('./routes/pricing.Routes');
const customerRoutes = require("./routes/customer.Routes");




connectDB();

const allowedOrigins = [
  process.env.WEBSITE_URL || "https://viraliq.ai",
  process.env.ADMIN_URL || "https://www.admin.viraliq.ai",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501"
];

app.use(cors({
  origin: function (origin, callback) {
   
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC FOLDER (IMPORTANT FIX)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/includes', express.static(path.join(__dirname, 'includes')));


app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/customers", customerRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive");
});


app.listen(port, ()=> {
    console.log(`server is runing on port : ${port}`);
});
