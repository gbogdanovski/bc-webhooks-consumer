import express, { Request, Response } from "express";

export const testController = express.Router();

testController.get("/", async (req: Request, res: Response) => {
    try {
        res.status(200).send(process.env);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});