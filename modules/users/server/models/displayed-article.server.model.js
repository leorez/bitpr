/**
 * Created by noruya on 16. 4. 24.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * 유저가 홈페이지에 게시한 기사목록
 */
var DisplayedArticleSchema = new Schema({
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


mongoose.model('DisplayedArticle', DisplayedArticleSchema);
