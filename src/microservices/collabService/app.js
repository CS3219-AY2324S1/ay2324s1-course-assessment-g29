const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

//connect to MongoDB database
const uri = "mongodb+srv://Keifu27:Blitzcrank1@peerprepcluster.uyctmek.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true}
    );
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

app.get('/', (req, res) => res.send('Hello World!'));

const roomsRouter = require('./routes/room');

app.use('/room', roomsRouter);

app.listen(port, () => console.log(`Express app running on port ${port}!`));