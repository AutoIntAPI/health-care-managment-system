import { Router } from "express";
import { DoctorController } from "../controllers/doctorController";

const router = Router();
const controller = new DoctorController();

router.post("/", controller.create.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));
router.get("/:id/availability", controller.getAvailability.bind(controller));
router.post("/:id/availability", controller.setAvailability.bind(controller));

export default router;
