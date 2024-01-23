import { dataSource } from "../configs/dbConfig";
import { Department } from "../entity/Department";

export const createDepartment = async (
  name: string,
): Promise<{
  statusCode: number;
  department?: Department | null;
  message: string;
}> => {
  try {
    const departmentRepository = dataSource.getRepository(Department);

    const department: Department | null = await departmentRepository.findOne({
      where: { name:name },
    });

    if (department !== null) {
      return {
        statusCode: 401,
        message: "Department already exists.",
      };
    }

    const newDepartment = departmentRepository.create({ name });
    await departmentRepository.save(newDepartment);

    return {
      statusCode: 201,
      department: newDepartment,
      message: "Department created is successful",
    };
  } catch (err) {
    console.error("Error creating Category", err);
    throw new Error("Error creating Category");
  }
};

export const getAllDepartments = async (): Promise<{
	statusCode: number;
	department?: Department[] | null;
	message: string;
   }> => {
	try {
	  const departmentRepository = dataSource.getRepository(Department);
	  const allDepartments = await departmentRepository.find();
   
	  return {
	    statusCode: 201,
	    department: allDepartments,
	    message: "All Departments fetched successfully",
	  };
	} catch (err) {
	  console.error("Error getting Group", err);
	  throw new Error("Error getting Group");
	}
   };