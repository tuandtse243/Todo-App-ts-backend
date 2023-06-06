import { Task } from "./tasks.entity";
import { AppDataSource } from "../..";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";
import { UpdateResult } from "typeorm";

class TasksController {

    public async getAll(req: Request, res: Response): Promise<Response> {
        // Declare a variable to hold all tasks
        let allTasks: Task[];

        // Fetch all tasks using the repository
        try {
            allTasks = await AppDataSource.getRepository(Task).find({
                order: {
                    date: "ASC"
                }
            });

            // Convert the tasks instance on a array of objects
            allTasks = instanceToPlain(allTasks) as Task[];

            return res.json(allTasks).status(200);

        } catch (_errors) {
            return res.json({ error: 'Internal Server Error' }).status(500);
        }
    }

    // Method for the post route
    public async create(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new instance of the task
        const newTask = new Task();

        // Add the required properties to the task object
        newTask.title = req.body.title;
        newTask.date = req.body.date;
        newTask.description = req.body.description;
        newTask.status = req.body.status;
        newTask.priority = req.body.priority;

        // Add the task to the database
        let createdTask: Task;

        try {
            createdTask = await AppDataSource.getRepository(Task).save(newTask);

            // Convert the task instance on a plain object
            createdTask = instanceToPlain(createdTask) as Task;
            return res.json(createdTask).status(201);
        } catch (error) {
            return res.json({ error: 'Internal Server Error' }).status(500);
        }
    }

    // Method for updating tasks
    public async update(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        // Try to find if the tasks exists
        let task: Task | null;

        try {
            task = await AppDataSource.getRepository(Task).findOne({where: {id: req.body.id}});
        } catch (error) {
            return res.json({ error: 'Internal Server Error' }).status(500);
        }

        // Return 400 if task is null
        if(!task) {
            return res.status(404).json({
                errors: 'The task with given ID does not exist'
            })
        }

        // Declare a variable for updatedTask
        let updatedTask: UpdateResult;   

        // Update the task
        try {
            updatedTask = await AppDataSource.getRepository(Task).update(req.body.id, plainToInstance(Task, {status: req.body.status}))

            updatedTask = instanceToPlain(updatedTask) as UpdateResult;

            return res.json(updatedTask).status(200);
        } catch (error) {
            return res.json({ error: 'Internal Server Error' }).status(500);
        }
    }
}

export const taskController = new TasksController();