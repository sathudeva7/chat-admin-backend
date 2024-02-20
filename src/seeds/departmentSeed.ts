import { dataSource } from "../configs/dbConfig"; // Adjust the import path as needed
import { Department } from "../entity/Department";

const departmentData = [
    { name: "Human Resources" },
    { name: "Engineering" },
    { name: "Marketing" },
    // Add more department objects as needed
];

export const seedDepartmentData = async () => {
    const departmentRepository = dataSource.getRepository(Department);
    for (const department of departmentData) {
        await departmentRepository.save(departmentRepository.create(department));
    }
    console.log("Department data seeded");
};
