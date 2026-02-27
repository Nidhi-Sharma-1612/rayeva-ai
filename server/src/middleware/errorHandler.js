const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`❌ [${statusCode}] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
