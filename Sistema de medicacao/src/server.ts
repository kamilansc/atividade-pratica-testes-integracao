import express from "express";
import { apiRouter } from "./routes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Painel de Medicacao no ar em http://localhost:${PORT}`);
});
