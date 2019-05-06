export function commentModel (mongoose) {
    const commentSchema = mongoose.Schema({
        movie_id: {
            type: Number,
            required: true
        },
        comment: {
            type:  String,
            required: true,
        },
        user_id: {
            type: String,
            required: true
        }
    });

    const comment = mongoose.model('Comments', commentSchema);
    return comment;
}