import { Router } from "express";
import { body } from "express-validator";
import validateRequest from "../../middleware/validateRequest.js";
import { categorize, getHistory, getOne } from "./categorizer.controller.js";

const router = Router();

const categorizerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 200 })
    .withMessage("Product name must be under 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description must be under 2000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("brand")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Brand must be under 100 characters"),
];

router.post("/", categorizerValidation, validateRequest, categorize);
router.get("/", getHistory);
router.get("/:id", getOne);

export default router;
