import express from "express";
import {
  createFaq,
  deleteFaq,
  getAllFaqs,
  updateFaq,
} from "../../controllers/faq/faq.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateToken, verifyPermission([USER_ROLES_ENUM.ADMIN]), createFaq)
  .get(getAllFaqs);

router
  .route("/:id")
  .patch(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.ADMIN]),
    updateFaq
  )
  .delete(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.ADMIN]),
    deleteFaq
  );
export default router;
