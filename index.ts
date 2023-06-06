import express, { Express } from "express"
import dotend from 'dotenv'
import { DataSource } from "typeorm";
import cors from 'cors';
import bodyParser from "body-parser";
import { Task } from "./src/tasks/tasks.entity";
import { tasksRouter } from "./src/tasks/tasks.router";

// Instantiate express app
const app: Express = express();
dotend.config();

// Parse request body
app.use(bodyParser.json());

// Use CORS install types as well
app.use(cors());

// Create Database Connection
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    entities: [
        Task
    ],
    synchronize: true,
})

// Define server port
const port = process.env.PORT


AppDataSource.initialize().then(() => {
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
    })
    console.log("Database Connected")
}).catch(error => console.log(error))

app.use('/', tasksRouter)
