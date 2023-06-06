import { body, ValidationChain } from "express-validator";

export const createValidator: ValidationChain[] = [
    body("title").notEmpty().withMessage("Title is required").trim().isString().withMessage("Title must be text"),

    body("description").notEmpty().withMessage("Description is required").trim().isString().withMessage("Description must be text"),

    body("date").notEmpty().withMessage("Date is required").trim().isString().withMessage("Date must be text"),

    body("status").trim().isIn(["todo", "in progress", "completed"]).withMessage("Status can only be todo, in progress or completed"),

    body("priority").trim().isIn(["low", "medium", "high"]).withMessage("Priority can only be normal, high or low"),
];

export const updateValidator: ValidationChain[] = [
    body('id').notEmpty().withMessage('Id is required').trim().isString().withMessage('Id need to be a valid uuid format'),

    body('status').trim().isIn(['todo', 'in progress', 'completed']).withMessage('Status can only be todo, in progress or completed'),
]