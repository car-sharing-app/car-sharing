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
const Fuel = db.fuel;
const Equipment = db.equipment;
const CarRental = db.carRental;
const Car = db.car;
const Address = db.address;

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
const fuelRouter = require('./routes/fuel.routes')
app.use('/fuel', fuelRouter);
const equipmentRouter = require('./routes/equipment.routes')
app.use('/equipment', equipmentRouter);
const carRouter = require('./routes/car.routes')
app.use('/car', carRouter);
const carRentalRouters = require('./routes/carRental.routes')
app.use("/car-rental", carRentalRouters.router);
app.use('/car-rental', carRentalRouters.adminRouter);
const reservationRouter = require('./routes/reservation.routes')
app.use('/reservation', reservationRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
    await db.sequelize.sync();
    const count = await User.count();
    if (count > 0) { return; }
    await Role.create({
        id: 1,
        name: "user"
    });

    await Role.create({
        id: 2,
        name: "admin"
    });

    const adminConfig = require('./config/defaultAdminConfig')
    await User.create({
        id: 1,
        username: adminConfig.username,
        email: adminConfig.email,
        password: bcrypt.hashSync(adminConfig.password, 8),
        phoneNumber: adminConfig.phoneNumber,
        roleId: 2,
        activeAccount: true
    })

    await CarCategory.create({
        id: 1,
        name: "mini"
    })
    await CarCategory.create({
        id: 2,
        name: "small"
    })
    await CarCategory.create({
        id: 3,
        name: "medium"
    })
    await CarCategory.create({
        id: 4,
        name: "large"
    })
    await CarCategory.create({
        id: 5,
        name: "executive"
    })
    await CarCategory.create({
        id: 6,
        name: "luxury"
    })
    await CarCategory.create({
        id: 7,
        name: "sport"
    })

    await Fuel.create({
        id: 1,
        name: "benzin"
    })

    await Fuel.create({
        id: 2,
        name: "diesel"
    })

    await Fuel.create({
        id: 3,
        name: "LPG"
    })

    await Fuel.create({
        id: 4,
        name: "electric"
    })

    const airConditioning = await Equipment.create({
        id: 1,
        name: "air conditioning"
    })
    const abs = await Equipment.create({
        id: 2,
        name: "ABS"
    })
    const centralLock = await Equipment.create({
        id: 3,
        name: "central lock"
    })
    const airbags = await Equipment.create({
        id: 4,
        name: "airbags"
    })
    const audioSystem = await Equipment.create({
        id: 5,
        name: "audio system"
    })
    const bluetooth = await Equipment.create({
        id: 6,
        name: "bluetooth"
    })
    const cruiseControl = await Equipment.create({
        id: 7,
        name: "cruise control"
    })
    const gps = await Equipment.create({
        id: 8,
        name: "GPS navigation"
    })

    const car1 = await Car.create({
        brand: "Kia",
        model: "Picanto",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: false,
        carCategoryId: 1,
        fuelId: 1
    })
    await car1.addEquipment(airConditioning);
    await car1.addEquipment(abs);
    await car1.addEquipment(centralLock);
    await car1.addEquipment(airbags);

    const car1Address = await Address.create({
        addressLine1: "ul. Miodowa 1",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 95,
        addressId: car1Address.id,
        carId: car1.id
    })

    const car2 = await Car.create({
        brand: "Toyota",
        model: "Yaris",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: false,
        carCategoryId: 2,
        fuelId: 1
    })
    await car2.addEquipment(airConditioning);
    await car2.addEquipment(abs);
    await car2.addEquipment(centralLock);
    await car2.addEquipment(airbags);

    const car2Address = await Address.create({
        addressLine1: "ul. Miodowa 2",
        addressLine2: null,
        city: "Warszawa",
        zipCode: "00-001"
    })

    await CarRental.create({
        prizePerDay: 99,
        addressId: car2Address.id,
        carId: car2.id
    })

    const car3 = await Car.create({
        brand: "Opel",
        model: "Astra",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: false,
        carCategoryId: 3,
        fuelId: 2
    })
    await car3.addEquipment(airConditioning);
    await car3.addEquipment(abs);
    await car3.addEquipment(centralLock);
    await car3.addEquipment(airbags);
    await car3.addEquipment(audioSystem);

    const car3Address = await Address.create({
        addressLine1: "ul. Miodowa 3",
        addressLine2: null,
        city: "Gdańsk",
        zipCode: "80-002"
    })

    await CarRental.create({
        prizePerDay: 139,
        addressId: car3Address.id,
        carId: car3.id
    })

    const car4 = await Car.create({
        brand: "Kia",
        model: "Cee'd",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: false,
        carCategoryId: 3,
        fuelId: 2
    })
    await car4.addEquipment(airConditioning);
    await car4.addEquipment(abs);
    await car4.addEquipment(centralLock);
    await car4.addEquipment(airbags);
    await car4.addEquipment(audioSystem);

    const car4Address = await Address.create({
        addressLine1: "ul. Miodowa 4",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 139,
        addressId: car4Address.id,
        carId: car4.id
    })

    const car5 = await Car.create({
        brand: "BMW",
        model: "1",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: true,
        carCategoryId: 4,
        fuelId: 1
    })
    await car5.addEquipment(airConditioning);
    await car5.addEquipment(abs);
    await car5.addEquipment(centralLock);
    await car5.addEquipment(airbags);
    await car5.addEquipment(audioSystem);

    const car5Address = await Address.create({
        addressLine1: "ul. Miodowa 5",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 179,
        addressId: car5Address.id,
        carId: car5.id
    })

    const car6 = await Car.create({
        brand: "Seat",
        model: "Arona",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: false,
        carCategoryId: 4,
        fuelId: 1
    })
    await car6.addEquipment(airConditioning);
    await car6.addEquipment(abs);
    await car6.addEquipment(centralLock);
    await car6.addEquipment(bluetooth);
    await car6.addEquipment(audioSystem);

    const car6Address = await Address.create({
        addressLine1: "ul. Miodowa 5",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 179,
        addressId: car6Address.id,
        carId: car6.id
    })

    const car7 = await Car.create({
        brand: "Opel",
        model: "Vivaro",
        doorsNumber: 4,
        personsNumber: 9,
        automaticTransmition: false,
        carCategoryId: 4,
        fuelId: 1
    })
    await car7.addEquipment(airConditioning);
    await car7.addEquipment(abs);
    await car7.addEquipment(centralLock);
    await car7.addEquipment(bluetooth);
    await car7.addEquipment(audioSystem);

    const car7Address = await Address.create({
        addressLine1: "ul. Miodowa 1",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 189,
        addressId: car7Address.id,
        carId: car7.id
    })

    const car8 = await Car.create({
        brand: "Mazda",
        model: "6",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: false,
        carCategoryId: 4,
        fuelId: 1
    })
    await car8.addEquipment(airConditioning);
    await car8.addEquipment(abs);
    await car8.addEquipment(centralLock);
    await car8.addEquipment(bluetooth);
    await car8.addEquipment(audioSystem);

    const car8Address = await Address.create({
        addressLine1: "ul. Miodowa 1",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 180,
        addressId: car8Address.id,
        carId: car8.id
    })

    const car9 = await Car.create({
        brand: "Toyota",
        model: "C-HR",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: true,
        carCategoryId: 5,
        fuelId: 1
    })
    await car9.addEquipment(airConditioning);
    await car9.addEquipment(abs);
    await car9.addEquipment(centralLock);
    await car9.addEquipment(bluetooth);
    await car9.addEquipment(audioSystem);
    await car9.addEquipment(cruiseControl);

    const car9Address = await Address.create({
        addressLine1: "ul. Miodowa 1",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 199,
        addressId: car9Address.id,
        carId: car9.id
    })

    const car10 = await Car.create({
        brand: "Kia",
        model: "Optima",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: true,
        carCategoryId: 4,
        fuelId: 2
    })
    await car10.addEquipment(airConditioning);
    await car10.addEquipment(abs);
    await car10.addEquipment(centralLock);
    await car10.addEquipment(bluetooth);
    await car10.addEquipment(audioSystem);
    await car10.addEquipment(airbags);

    const car10Address = await Address.create({
        addressLine1: "ul. Miodowa 1",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 199,
        addressId: car10Address.id,
        carId: car10.id
    })


    const car11 = await Car.create({
        brand: "Kia",
        model: "Picanto",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: true,
        carCategoryId: 1,
        fuelId: 1
    })
    await car11.addEquipment(airConditioning);
    await car11.addEquipment(abs);
    await car11.addEquipment(centralLock);
    await car11.addEquipment(airbags);

    const car11Address = await Address.create({
        addressLine1: "ul. Miodowa 1",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 95,
        addressId: car11Address.id,
        carId: car11.id
    })

    const car12 = await Car.create({
        brand: "Toyota",
        model: "Yaris",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: true,
        carCategoryId: 2,
        fuelId: 1
    })
    await car12.addEquipment(airConditioning);
    await car12.addEquipment(abs);
    await car12.addEquipment(centralLock);
    await car12.addEquipment(airbags);

    const car12Address = await Address.create({
        addressLine1: "ul. Miodowa 2",
        addressLine2: null,
        city: "Warszawa",
        zipCode: "00-001"
    })

    await CarRental.create({
        prizePerDay: 99,
        addressId: car12Address.id,
        carId: car12.id
    })


    const car13 = await Car.create({
        brand: "Opel",
        model: "Astra",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: true,
        carCategoryId: 3,
        fuelId: 3
    })
    await car13.addEquipment(airConditioning);
    await car13.addEquipment(abs);
    await car13.addEquipment(centralLock);
    await car13.addEquipment(airbags);
    await car13.addEquipment(audioSystem);

    const car13Address = await Address.create({
        addressLine1: "ul. Miodowa 3",
        addressLine2: null,
        city: "Gdańsk",
        zipCode: "80-002"
    })

    await CarRental.create({
        prizePerDay: 139,
        addressId: car13Address.id,
        carId: car13.id
    })

    const car14 = await Car.create({
        brand: "Kia",
        model: "Cee'd",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: true,
        carCategoryId: 4,
        fuelId: 4
    })
    await car14.addEquipment(airConditioning);
    await car14.addEquipment(abs);
    await car14.addEquipment(centralLock);
    await car14.addEquipment(airbags);
    await car14.addEquipment(audioSystem);

    const car14Address = await Address.create({
        addressLine1: "ul. Miodowa 4",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 139,
        addressId: car14Address.id,
        carId: car14.id
    })

    const car15 = await Car.create({
        brand: "BMW",
        model: "1",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: false,
        carCategoryId: 5,
        fuelId: 1
    })
    await car15.addEquipment(airConditioning);
    await car15.addEquipment(abs);
    await car15.addEquipment(centralLock);
    await car15.addEquipment(airbags);
    await car15.addEquipment(audioSystem);

    const car15Address = await Address.create({
        addressLine1: "ul. Miodowa 5",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 179,
        addressId: car15Address.id,
        carId: car15.id
    })

    const car16 = await Car.create({
        brand: "BMW",
        model: "1",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: true,
        carCategoryId: 6,
        fuelId: 1
    })
    await car16.addEquipment(airConditioning);
    await car16.addEquipment(abs);
    await car16.addEquipment(centralLock);
    await car16.addEquipment(airbags);
    await car16.addEquipment(audioSystem);
    await car16.addEquipment(gps)

    const car16Address = await Address.create({
        addressLine1: "ul. Miodowa 5",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 179,
        addressId: car16Address.id,
        carId: car16.id
    })

    const car17 = await Car.create({
        brand: "BMW",
        model: "1",
        doorsNumber: 5,
        personsNumber: 5,
        automaticTransmition: false,
        carCategoryId: 7,
        fuelId: 4
    })
    await car17.addEquipment(airConditioning);
    await car17.addEquipment(abs);
    await car17.addEquipment(centralLock);
    await car17.addEquipment(airbags);
    await car17.addEquipment(audioSystem);
    await car17.addEquipment(gps)

    const car17Address = await Address.create({
        addressLine1: "ul. Miodowa 5",
        addressLine2: null,
        city: "Kraków",
        zipCode: "30-002"
    })

    await CarRental.create({
        prizePerDay: 179,
        addressId: car17Address.id,
        carId: car17.id
    })
}
initial();