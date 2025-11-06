const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/", appointmentController.create);
router.get("/:id", appointmentController.getById);
router.get("/", appointmentController.getAll);
router.put("/:id", appointmentController.update);
router.delete("/:id", appointmentController.cancel);
router.get("/patient/:patientId", appointmentController.getByPatient);
router.get("/doctor/:doctorId", appointmentController.getByDoctor);

module.exports = router;
