/**
 * Widget news main file
 */

module.exports = function (projectPath, Widget) {
  const widget = new Widget('news', __dirname);

  widget.beforeSave = function disqusWidgetBeforeSave(req, res, next) {
    req.body.configuration = {
      limit: req.body.limit
    };
    return next();
  };

  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {

    let limit = 6;

    const conf = widget.configuration;
    if (conf && conf.limit && Number(conf.limit)) {
      limit = Number(conf.limit);
    }

    return req.we.db.models.news
    .findAll({
      where: { published: true },
      order: [
        ['highlighted', 'DESC'],
        ['publishedAt', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: limit
    })
    .then( (p)=> {
      if (!p || !p.length) {
        widget.hide = true;
      }

      widget.news = p;
      next();
    })
    .catch(next);
  };

  return widget;
};