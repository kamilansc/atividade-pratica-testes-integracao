import { Router } from "express";
import { medicationsController } from "./controller";

export const apiRouter = Router();
const medicationsRouter = Router();

apiRouter.get("/health", medicationsController.health);
apiRouter.use("/medications", medicationsRouter);

medicationsRouter.get("/", medicationsController.list);
medicationsRouter.post("/", medicationsController.create);
medicationsRouter.get("/:id", medicationsController.getById);
medicationsRouter.delete("/:id", medicationsController.remove);
