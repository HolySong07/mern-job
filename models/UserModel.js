import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	lastName: {
		type: String,
		default: 'lastName',
	},
	location: {
		type: String,
		default: 'my city',
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	avatar: String,
	avatarPublicId: String,
});

// создали метод, удаляем пароль, чтобы он не отправлялся пользователю обратно на страницу
UserSchema.methods.toJSON = function () {
	var obj = this.toObject();
	delete obj.password;
	return obj;
};

export default mongoose.model('User', UserSchema);
