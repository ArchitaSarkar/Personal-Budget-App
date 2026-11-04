import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import "dotenv/config";
import express,{ NextFunction, Request,Response} from "express";
import { Env } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "./routes/auth.route";
import "./config/passport.config";
import userRoutes from "./routes/user.route";
import cors from "cors";
import { error } from "console";
import { BadRequestException } from "./utils/app-error";
import connctDatabase from "./config/database.config";
import passport, { initialize } from "passport";
import { passportAuthenticateJwt } from "./config/passport.config";
import transactionRoutes from "./routes/transaction.route";
import { startJobs } from "./crons/scheduler";
import { initializeCrons } from "./crons";
import { report } from "process";
import reportRoutes from "./routes/report.route";
import { getDateRange } from "./utils/date";
import analyticsRoutes from "./routes/analytics.route";





const app = express();
const BASE_PATH = Env.BASE_PATH ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));    

app.use(passport.initialize());

app.use(
    cors({
        origin: Env.FRONTEND_ORIGIN,
        credentials: true,
    })  
);

app.get("/", (req: Request, res: Response) => {
  res.status(HTTPSTATUS.OK).json({
    message: "Welcome to Finance App Backend",
    status: "healthy",
  });
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, transactionRoutes);
app.use(`${BASE_PATH}/report`, passportAuthenticateJwt, reportRoutes);
app.use(`${BASE_PATH}/analytics`, passportAuthenticateJwt, analyticsRoutes);

app.use(errorHandler);

const startServer = async () => {
  await connctDatabase();

  await initializeCrons();

  app.listen(Env.PORT, () => {
    console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
  });
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app };
export default app;

