import express from "express";
import { Shibuya } from "./controller/shibuya";
import cron from "node-cron";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const KitamiIR = Shibuya.KitamiIR;
const IchinoseIR = Shibuya.IchinoseIR;

cron.schedule("10 8 * * 1-5", async () => {
  KitamiIR.fullPower();
});

cron.schedule("40 7 * * 1-5", async () => {
  IchinoseIR.send("20", 0, 24, 0, 0);
});

app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: "." });
});

app.post("/light/on", (req, res) => {
  KitamiIR.fullPower();
  res.redirect("/");
});

app.post("/light/off", (req, res) => {
  KitamiIR.off();
  res.redirect("/");
});

app.post("/aircon", (req, res) => {
  IchinoseIR.send(
    req.body.power,
    req.body.mode,
    req.body.temp,
    req.body.fan,
    req.body.swing
  );
  res.redirect("/");
});

app.listen(3000);
