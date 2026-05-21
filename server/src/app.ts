import express from "express";
import sequelize from "./config/database.js";
import type { Request, Response } from "express";
import router from "./route.js";
import { requestContext } from "./middleware/requestContext.js";
import { getLogger } from "./utils/logger.js";
import errorHandler from "./middleware/errorHandler.js";

const logger = getLogger("App");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestContext);

app.use("/api/v1", router);

// Global Error Handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connected successfully.");
    await sequelize.sync({ alter: true }); // Uncommented when models are added
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error({ msg: "Unable to connect to the database:", error });
  }
};

startServer();
