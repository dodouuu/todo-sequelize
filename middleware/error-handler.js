module.exports = {
  errorHandler: (error, req, res, next) => {
    error instanceof Error
      ? req.flash('error_messages', `${error.name}: ${error.message}`)
      : req.flash('error_messages', `${error}`)
    res.redirect('back')
    next(error)
  }
}
