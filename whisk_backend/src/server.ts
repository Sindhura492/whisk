import express, { type Request, type Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Enable CORS
app.use(cors()); // Allow all origins

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
	res.send("Hello, World!");
});

app.post("/chat", (req: Request, res: Response) => {
	const { message } = req.body;
	res.json({ response: `You said: ${message}` });
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
