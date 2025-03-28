import express from "express";
import {
  createLead,
  deleteLeadById,
  getAllLeads,
  updateLeadById,
} from "../../controllers/leads/leads.js";

const router = express.Router();

router.route("/").post(createLead).get(getAllLeads); // ?status=&propertyOrProject=
router.route("/:id").patch(updateLeadById).delete(deleteLeadById);

export default router;
