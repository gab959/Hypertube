export function userModel (mongoose, uniqueValidator) {
    const userSchema = mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
            match: [
                /^(?=.{3,30}$)(?![_.-])(?!.*[_.-]{2})[\sA-Za-zÀ-ÖØ-öø-ÿ0-9_-]+([^._-])$/,
                "Path `username` is invalid"
            ],
            index: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: [
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))$/,
                "Path `email` is invalid"
            ],
            index: true
        },
        firstname: {
            type: String,
            required: true,
            match: [
                /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{3,}$/,
                "Path `firstname` is invalid"
            ]
        },
        lastname: {
            type: String,
            required: true,
            match: [
                /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{3,}$/,
                "Path `lastname` is invalid"
            ]
        },
        password: {
            type: String,
            required: [
                true,
                "Path `password` is required. Password must contain: at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number."
            ]
        },
        picture: {
            type: String,
            required: [
                true,
                "Profile picture is not defined."
            ]
        },
        language: {
            type: String,
            required: [
                true,
                "Language is not defined."
            ]
        },
        key: {
            type: String,
            default: null
        },
        oauth: {
            type: Boolean,
            required: [
                true,
                "OmniAuth boolean is not defined."
            ]
        },
        movie: {
            type: Array,
            default: []
        }
    });
    userSchema.plugin(uniqueValidator);

    const user = mongoose.model('Users', userSchema);
    return user;
}
