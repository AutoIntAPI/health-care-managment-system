// In-memory user storage (replace with database in production)
class UserModel {
	constructor() {
		this.users = [];
		this.currentId = 1;
	}

	create(userData) {
		const user = {
			id: this.currentId++,
			...userData,
			createdAt: new Date().toISOString(),
		};
		this.users.push(user);
		return user;
	}

	findByEmail(email) {
		return this.users.find((user) => user.email === email);
	}

	findById(id) {
		return this.users.find((user) => user.id === id);
	}

	getAll() {
		return this.users.map((user) => {
			const { password, ...userWithoutPassword } = user;
			return userWithoutPassword;
		});
	}

	update(id, updates) {
		const index = this.users.findIndex((user) => user.id === id);
		if (index !== -1) {
			this.users[index] = { ...this.users[index], ...updates };
			return this.users[index];
		}
		return null;
	}

	delete(id) {
		const index = this.users.findIndex((user) => user.id === id);
		if (index !== -1) {
			return this.users.splice(index, 1)[0];
		}
		return null;
	}
}

module.exports = new UserModel();
