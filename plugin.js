/**
 * We.js news plugin main file
 */

const newsFindAll = require('./lib/metatags/newsFindAll.js'),
  newsFindOne = require('./lib/metatags/newsFindOne.js');

module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setConfigs({
    permissions: {
      'access_news_unpublished': {
        'title': 'Access unpublished news'
      }
    },
  });

  plugin.setResource({
    name: 'news',
    findAll: { metatagHandler: 'newsFindAll' },
    findOne: { metatagHandler: 'newsFindOne' }
  });

  plugin.setMetatagHandlers = function setMetatagHandlers(we) {
    if (we.router.metatag && we.router.metatag.add) {
      we.router.metatag.add('newsFindAll', newsFindAll);
      we.router.metatag.add('newsFindOne', newsFindOne);
    }
  }

  /**
   * Plugin fast loader for speed up We.js project bootstrap
   *
   * @param  {Object}   we
   * @param {Function} done    callback
   */
  plugin.fastLoader = function fastLoader(we, done) {
    // - Controllers:
    we.controllers.news = new we.class.Controller( require('./server/controllers/news.js') );
    // - Models:
    we.db.modelsConfigs.news = require('./server/models/news.js')(we);

    done();
  }

  plugin.setCanonicalURL = require('./lib/metatags/setCanonicalURL.js');

  plugin.events.on('we:after:load:plugins', plugin.setMetatagHandlers);

  return plugin;
};