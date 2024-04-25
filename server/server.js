import { express } from "express";
import { cors } from "cors";
import { index } from "./routes/index.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
