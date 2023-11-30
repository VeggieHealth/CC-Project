const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const bodyParser = require("body-parser");
require("./middlewares/passport");

const app = express();
const PORT = process.env.PORT || 8080;
// const PORT = 3000;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.get('/', function (req, res) {
    res.send('hello word');
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});