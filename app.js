const express = require("express");
const app = express();
const port = process.env.port || 3000;

const imageRouter = require("./imageProcessor");
const db = require("./db");
const dbClient = require("./middleware/dbMiddleware");

db.connect()
.then(() => {
    console.log('Connected to PostgreSQL database');
})
.catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
});

app.use(dbClient(db));


app.use(express.json());
app.use("/api/images", imageRouter)

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
});