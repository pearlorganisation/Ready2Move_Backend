import express from "express";
import {
  createLead,
  deleteLeadById,
  getAllLeads,
  updateLeadById,
} from "../../controllers/leads/leads.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(createLead)
  .get(
    authenticateToken,
    verifyPermission([
      // change the permissions to the ones you want ask client
      USER_ROLES_ENUM.ADMIN,
      USER_ROLES_ENUM.BUILDER,
      USER_ROLES_ENUM.AGENT,
    ]),
    getAllLeads
  ); // ?status=&propertyOrProject=
router
  .route("/:id")
  .patch(
    authenticateToken,
    verifyPermission([
      USER_ROLES_ENUM.ADMIN,
      USER_ROLES_ENUM.BUILDER,
      USER_ROLES_ENUM.AGENT,
    ]),
    updateLeadById
  )
  .delete(
    authenticateToken,
    verifyPermission([
      USER_ROLES_ENUM.ADMIN,
      USER_ROLES_ENUM.BUILDER,
      USER_ROLES_ENUM.AGENT,
    ]),
    deleteLeadById
  );

export default router;
