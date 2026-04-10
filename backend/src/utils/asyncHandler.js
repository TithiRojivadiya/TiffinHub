// Higher order function -> they take function as parameter and can return function
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        // .catch((err) => next(err))
        .catch((err) => console.log(err))
    }
}


export {asyncHandler}