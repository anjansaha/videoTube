import { validationResult } from "express-validator";

function validateRequest(req, res, next) {  
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map(e => ({
    field: e.path,
    message: e.msg,
  }));
  return res.status(400).json({ errors: formatted });
}
export { validateRequest };