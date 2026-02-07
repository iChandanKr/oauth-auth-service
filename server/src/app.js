import express from "express";
import sequelize from "./config/database.js";
import router from "./route.js";
const app = express();
const port = process.env.PORT || 3000;
app.use("/api", router);
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully.");
        await sequelize.sync(); // Uncommented when models are added
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
startServer();
//# sourceMappingURL=app.js.map