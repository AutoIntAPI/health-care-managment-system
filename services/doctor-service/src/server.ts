import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import doctorRoutes from "./routes/doctorRoutes";

const app: Application = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req: Request, res: Response) => {
	res.status(200).json({ status: "OK", service: "doctor-service" });
});

// Routes
app.use("/api/doctors", doctorRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
	console.log(`Doctor Service running on port ${PORT}`);
});
