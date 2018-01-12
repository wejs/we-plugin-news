/**
 * Widget news main file
 *
 * See https://github.com/wejs/we-core/blob/master/lib/class/Widget.js for all Widget prototype functions
 */

module.exports = function (projectPath, Widget) {
  const widget = new Widget('news', __dirname);

  // // Override default widget class functions after instance
  //
  // widget.beforeSave = function widgetBeforeSave(req, res, next) {
  //   // do something after save this widget in create or edit ...
  //   return next();
  // };

  // // form middleware, use for get data for widget form
  // widget.formMiddleware = function formMiddleware(req, res, next) {
  //
  //   next();
  // }

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {
    return req.we.db.models['news']
    .findAll({
      where: { published: true },
      order: [
        ['highlighted', 'DESC'],
        ['publishedAt', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: 4
    })
    .then( (p)=> {
      widget.news = p;
      next();
      return null;
    })
    .catch(next);
  }

  return widget;
};