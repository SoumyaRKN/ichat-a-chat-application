const { connect, Schema, model, models } = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    // use `await connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    await connect(process.env.MONGO_URL);
}

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true }
});

module.exports = models.User || model('User', UserSchema);