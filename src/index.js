const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;

db.sequelize.sync();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
});


const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);
const userRouter = require('./routes/user.routes');
app.use('/user', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "admin"
    });
}
initial();