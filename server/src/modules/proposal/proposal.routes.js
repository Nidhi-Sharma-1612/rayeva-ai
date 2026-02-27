import { Router } from "express";
import { body } from "express-validator";
import validateRequest from "../../middleware/validateRequest.js";
import { generate, getHistory, getOne } from "./proposal.controller.js";

const router = Router();

const proposalValidation = [
  body("company_name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 200 })
    .withMessage("Company name must be under 200 characters"),

  body("industry").trim().notEmpty().withMessage("Industry is required"),

  body("budget")
    .notEmpty()
    .withMessage("Budget is required")
    .isFloat({ min: 1 })
    .withMessage("Budget must be a positive number"),

  body("categories")
    .isArray({ min: 1 })
    .withMessage("At least one product category is required"),

  body("sustainability_preferences")
    .isArray({ min: 1 })
    .withMessage("At least one sustainability preference is required"),
];

router.post("/", proposalValidation, validateRequest, generate);
router.get("/", getHistory);
router.get("/:id", getOne);

export default router;
