import express from "express";
import { getCityWithLocality } from "../../controllers/footer/footer.js";

const router = express.Router();

router.route("/cityWithLocality").get(getCityWithLocality);

export default router;
