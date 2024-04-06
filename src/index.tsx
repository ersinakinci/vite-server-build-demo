// CompressionStream polyfill for Bun, needed for compress middleware
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import Layout from "./views/layout";

const app = new Hono();

// Assets
app.use(
  "/assets/*",
  serveStatic({ root: import.meta.env.PROD ? "./dist" : "./src" })
);

// App
app.get("*", Layout);
app.get("/", (c) => c.render(<h1>Hello, world!</h1>));

showRoutes(app);

serve(app);

export default app;
