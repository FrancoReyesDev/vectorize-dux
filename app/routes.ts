import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/search.tsx"),
  route("/database", "routes/database.tsx"),
] satisfies RouteConfig;
