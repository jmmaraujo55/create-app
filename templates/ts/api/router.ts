import { Application } from "express";
import { exampleRoutes } from "./example.route";

export class Router {
  constructor(app: Application) {
    app.get("/v1/healthcheck", (_, res) => res.json({ status: "ok" }));
    app.get("/v1", (_, res) => res.json({ status: "ok" }));

    app.use("/v1/example", exampleRoutes);
  }
}
