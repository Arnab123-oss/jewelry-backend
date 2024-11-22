export const errorMiddleware = (err, req, res, next) => {
    // err.message = err.message || theb last line is the modifying version of this line "
    err.message || (err.message = "");
    err.statusCode || (err.statusCode = 500);
    if (err.name === "CastError")
        err.message = "Invalid Id";
    res.status(404).json({
        status: false,
        message: err.message
    });
};
export const asyncHandler = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch(next);
    };
};
