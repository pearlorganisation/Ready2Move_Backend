import express from "express";
import {
  createFeature,
  deleteFeatureById,
  getAllFeatures,
  updateFeatureById,
} from "../../controllers/feature/feature.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middlewares/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .get(
    authenticateToken,
    verifyPermission([
      USER_ROLES_ENUM.ADMIN,
      USER_ROLES_ENUM.BUILDER,
      USER_ROLES_ENUM.AGENT,
    ]),
    getAllFeatures
  )
  .post(
    authenticateToken,
    verifyPermission([
      USER_ROLES_ENUM.ADMIN,
      USER_ROLES_ENUM.BUILDER,
      USER_ROLES_ENUM.AGENT,
    ]),
    createFeature
  ); //By default paging is false, when showing on adminPanel paging will be on the basis of type

router
  .route("/:id")
  .patch(
    authenticateToken,
    verifyPermission([
      USER_ROLES_ENUM.ADMIN,
      USER_ROLES_ENUM.BUILDER,
      USER_ROLES_ENUM.AGENT,
    ]),
    updateFeatureById
  )
  .delete(
    authenticateToken,
    verifyPermission([
      USER_ROLES_ENUM.ADMIN,
      USER_ROLES_ENUM.BUILDER,
      USER_ROLES_ENUM.AGENT,
    ]),
    deleteFeatureById
  );

export default router;
