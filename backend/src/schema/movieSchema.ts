export function movieModel (mongoose, uniqueValidator) {
    const movieSchema = mongoose.Schema({
        movie_id: {
            type: Number,
            unique: true,
            required: true
        },
        name: {
            type: String,
            unique: true,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Number,
            required: true
        },
        isComplete: {
            type: Boolean,
            required: true
        }
    });
    movieSchema.plugin(uniqueValidator);

    const movie = mongoose.model('Movies', movieSchema);
    return movie;
}
