/**
 * Created by noruya on 16. 4. 24.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * 유저가 설정한 시간에 자동으로 수집된 기사
 */
var CrawledArticleSchema = new Schema({
  keyword: {
    type: String,
    trim: true,
    required: 'Keyword cannot be blank'
  },
  title: {
    type: String,
    trim: true,
    default: '',
    required: 'Title cannot be blank'
  },
  summary: {
    type: String,
    trim: true,
    default: '',
    required: 'Summary cannot be blank'
  },
  media: {
    type: String,
    trim: true,
    default: '',
    required: 'Media cannot be blank'
  },
  url: {
    type: String,
    trim: true,
    default: '',
    required: 'Url cannot be blank'
  },
  articleAt: {
    type: Date,
    required: 'ArticleAt cannot be blank'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('CrawledArticle', CrawledArticleSchema);
