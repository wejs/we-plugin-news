function metatagFindAll(req, res, next) {
  const we = req.we;

  req.we.plugins['we-plugin-news'].setCanonicalURL(req, res);

  const siteName = (we.systemSettings.siteName || we.config.appName);
  const hostname = we.config.hostname;

  res.locals.metatag +=
    '<meta property="og:url" content="'+hostname+req.urlBeforeAlias+'" />'+
    '<meta property="og:title" content="Notícias do(a) '+siteName+'" />' +
    '<meta property="og:site_name" content="'+siteName+'" />'+
    '<meta property="og:type" content="website" />'+
    '<meta content="'+siteName+'" itemprop="name">';

  if (we.systemSettings.siteDescription) {
    const description = we.utils
                          .string(we.systemSettings.siteDescription)
                          .stripTags()
                          .truncate(200).s;
    res.locals.metatag += '<meta property="og:description" content="'+
      description+
    '" />';
    res.locals.metatag += '<meta content="'+description+'" name="description">';
    res.locals.metatag += '<meta content="'+description+'" name="twitter:description">';
  }

  if (we.systemSettings.ogImageUrlOriginal) {
    const imageUrl = we.systemSettings.ogImageUrlOriginal
    res.locals.metatag +=
      '<meta property="og:image" content="'+hostname+imageUrl+'" />';
  }

  if (we.systemSettings.metatagKeywords) {
    res.locals.metatag +=
      '<meta name="keywords" content="'+we.systemSettings.metatagKeywords+'" />';
  }

  next();
}

module.exports = metatagFindAll;