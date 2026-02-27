import {
  generateProposal,
  getAllProposals,
  getProposalById,
} from "./proposal.service.js";

/**
 * POST /api/proposal
 */
export const generate = async (req, res, next) => {
  try {
    const {
      company_name,
      industry,
      budget,
      categories,
      sustainability_preferences,
    } = req.body;

    const result = await generateProposal({
      company_name,
      industry,
      budget,
      categories,
      sustainability_preferences,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/proposal
 */
export const getHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const results = await getAllProposals(limit);

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
 * GET /api/proposal/:id
 */
export const getOne = async (req, res, next) => {
  try {
    const result = await getProposalById(req.params.id);

    if (!result) {
      const err = new Error("Proposal not found");
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
