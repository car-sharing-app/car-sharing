const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const bcrypt = require('bcryptjs')

app.use(cors());


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
const User = db.user;
const CarCategory = db.carCategory;

db.sequelize.sync();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
});


const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);
const userRouters = require('./routes/user.routes');
app.use('/user', userRouters.router);
app.use('/user', userRouters.adminRouter);
const profileRouter = require('./routes/profile.routes');
app.use('/profile', profileRouter);
const carCategoryRouter = require('./routes/carCategory.routes')
app.use('/car-category', carCategoryRouter);

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

    const adminConfig = require('./config/defaultAdminConfig')
    User.create({
        username: adminConfig.username,
        email: adminConfig.email,
        password: bcrypt.hashSync(adminConfig.password, 8),
        phoneNumber: adminConfig.phoneNumber,
        roleId: 2,
        activeAccount: true
    })

    CarCategory.create({
        id: 1,
        name: "mini"
    })
    CarCategory.create({
        id: 2,
        name: "small"
    })
    CarCategory.create({
        id: 3,
        name: "medium"
    })
    CarCategory.create({
        id: 4,
        name: "large"
    })
    CarCategory.create({
        id: 5,
        name: "executive"
    })
    CarCategory.create({
        id: 6,
        name: "luxury"
    })
    CarCategory.create({
        id: 7,
        name: "sport"
    })
}
initial();