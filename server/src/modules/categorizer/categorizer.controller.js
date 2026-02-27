import {
  categorizeProduct,
  getAllResults,
  getResultById,
} from "./categorizer.service.js";

/**
 * POST /api/categorizer
 */
export const categorize = async (req, res, next) => {
  try {
    const { name, description, price, brand } = req.body;
    const result = await categorizeProduct({ name, description, price, brand });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categorizer
 */
export const getHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const results = await getAllResults(limit);

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categorizer/:id
 */
export const getOne = async (req, res, next) => {
  try {
    const result = await getResultById(req.params.id);

    if (!result) {
      const err = new Error("Result not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
