const express = require("express");
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
db();

app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });

const rou = require('./routes/api')
app.use('/data', rou);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // If sending form data

const orderRoutes = require('./routes/orderRoute'); // Import order routes
app.use('/orders', orderRoutes);

const userRoutes = require('./routes/userRoute'); // Import user routes
app.use('/users', userRoutes);


app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});
