import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.json({ status: "ok" });
});

export default {
  routes: "/health",
  setup: undefined,
  router,
} satisfies Bluefin.Sakai;
