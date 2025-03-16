const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();

    bcrypt.genSalt(10)
    .then(salt => {
        return bcrypt.hash(this.password, salt);
    })

    .then(hashedPassword => {
        this.password = hashedPassword;
        console.log(`Hash of password successful for user ${this.username}`);
        next();
    })

    .catch(error => {
        console.error('Error with hashing:', error);
        next(error);
    });
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
    .then(isMatch => {
        if (!isMatch) {
            console.log(`Password failed for user ${this.username}`);
        }
        return isMatch;
    })
    .catch(error => {
        console.error('Error matching passwords:', error);
        throw error;
    })
};


const User = mongoose.model('User', UserSchema);
module.exports = User;