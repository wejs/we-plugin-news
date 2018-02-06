/**
 * News model
 */

module.exports = function M(we) {
  const model = {
    definition: {
      published: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: false,
        formFieldType: null
      },
      highlighted: {
        type: we.db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        formFieldType: null
      },
      showInLists: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: true,
        formFieldType: null
      },
      allowComments: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: true,
        formFieldType: null
      },
      title: {
        type: we.db.Sequelize.STRING,
        allowNull: false
      },
      about: {
        type: we.db.Sequelize.TEXT,
        allowNull: true,
        formFieldType: 'textarea',
      },
      body: {
        type: we.db.Sequelize.TEXT,
        allowNull: true,
        formFieldType: 'html',
        formFieldHeight: 400
      },
      publishedAt: {
        type: we.db.Sequelize.DATE,
        allowNull: true
      },
      categoryItem: {
        type: we.db.Sequelize.VIRTUAL,
        get() {
          const category = this.get('category');
          if (category && category.length) {
            return category[0];
          }

          return null;
        }
      }
    },

    associations: {
      creator: {
        type: 'belongsTo',
        model: 'user'
      },
      cats: {
        type: 'belongsToMany',
        // as: 'Tasks',
        through: {
          model: 'modelsterms',
          unique: false,
          constraints: false,
          scope: {
            modelName: 'news'
          }
        },
        constraints: false,
        foreignKey: 'modelId',
        // otherKey: 'termId',
        //type: 'hasMay',
        model: 'term'
      }
    },
    options: {
      // title field, for default title record pages
      titleField: 'title',

      termFields: {
        tags: {
          vocabularyName: null,
          canCreate: true,
          formFieldMultiple: true,
          onlyLowercase: true
        }
      },

      imageFields: {
        featuredImage: { formFieldMultiple: false },
        images: { formFieldMultiple: true }
      },

      fileFields: {
        attachment: { formFieldMultiple: true }
      },

      classMethods: {
        // suport to we.js url alias feature
        urlAlias(record) {
          return {
            alias: '/noticias/' + record.id + '-'+  we.utils
              .string( record.title )
              .truncate(60)
              .slugify().s,
            target: '/news/' + record.id,
          };
        }

      },
      instanceMethods: {},
      hooks: {
        beforeCreate(r, opts, done) {
          if (r.published) {
            r.publishedAt = Date.now();
          }

          done();
          return r;
        },

        beforeUpdate(r, opts, done) {
          if (r.published && !r.publishedAt) {
            // set publishedAt on publish:
            r.publishedAt = Date.now();
          } else if (!r.published && r.publishedAt) {
            // reset publishedAt on unpublish
            r.publishedAt = null;
          }

          done();
          return r;
        }

      }
    }
  };

  return model;
};