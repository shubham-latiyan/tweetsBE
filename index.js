require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
let router = express.Router();
const bodyParser = require('body-parser');
app.use(bodyParser());
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const option = {
    socketTimeoutMS: 0,
    connectTimeoutMS: 0,
    useNewUrlParser: true
};
// connect to db
mongoose.connect(process.env.mongodbConnectionString, option, function (err) {
    if (err)
        console.log(err);
    else
        console.log('connected..')
});


app.use(cors());

const apiRoutes = require('./routes/api');


// Routes setup
app.use('/api', apiRoutes);


app.get("/", (req, res) => {
    res.send("<h3>Server is Up and running<\h3>")
})
// app.use('/routes',root);
app.listen(3500, function (req, res) {
    console.log('server is runnig on port 3500');
});

module.exports = router;