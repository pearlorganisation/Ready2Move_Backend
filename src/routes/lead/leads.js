import express from "express";
import { createLead, getAllLeads } from "../../controllers/leads/leads.js";

const router = express.Router();

router.route("/").post(createLead).get(getAllLeads);

export default router;
