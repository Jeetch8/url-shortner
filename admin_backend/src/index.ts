import { Appication } from "./application";
import { AuthRouter } from "./routes/auth.routes";
import { DashboardRouter } from "./routes/dashboard.routes";
import { ShortnerRouter } from "./routes/shortner.routes";
import { UserRouter } from "./routes/user.routes";

const app = new Appication([
  { path: "auth", router: new AuthRouter() },
  { path: "dashboard", router: new DashboardRouter() },
  { path: "url", router: new ShortnerRouter() },
  { path: "user", router: new UserRouter() },
]);
app.startServer();
