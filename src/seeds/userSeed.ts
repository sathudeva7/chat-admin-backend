import { dataSource } from "../configs/dbConfig"; // Adjust the import path as needed
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

const userData = [
    { username: "johnDoe", email: "john@example.com", password: "password123", role: "admin", status: "Active" },
    // Add more user objects as needed
];

export const seedUserData = async () => {
    const userRepository = dataSource.getRepository(User);
    for (const user of userData) {
	const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password
	const userWithHashedPassword = { ...user, password: hashedPassword }; // Replace plain password with hashed
	await userRepository.save(userRepository.create(userWithHashedPassword));
    }
    console.log("User data seeded");
};
