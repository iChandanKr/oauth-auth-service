import express, { Router } from "express";
import registerRoutes from "./utils/routeHelper.js";
const router: Router = express.Router();

import path from "path";
import { glob } from "glob";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiFiles: string[] = glob.sync(`${path.join(__dirname)}/**/*.api.{ts,js}`);

for (const file of apiFiles) {
  const api = await import(file);
  router.use(registerRoutes(api.default || api));
}
export default router;
