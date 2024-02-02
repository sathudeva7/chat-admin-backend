import { dataSource } from "../configs/dbConfig";
import { Chat } from "../entity/Chat";
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
    const chatRepository = dataSource.getRepository(Chat);
    const messageCount = await chatRepository.createQueryBuilder('chat')
    .select('department.id', 'departmentId')
    .addSelect('COUNT(chat.id)', 'chatCount')
    .leftJoin('chat.department', 'department')
    .where('chat.status IN (:...statuses)', { statuses: ['Init', 'Inprog'] })
    .groupBy('department.id')
    .getRawMany();

    console.log(messageCount);
  

	  const allDepartments = await departmentRepository.find();

    const output = allDepartments.map((department) => {
      const chatCount = messageCount.find((item) => item.departmentId === department.id);
      return {
        ...department,
        chatCount: chatCount ? chatCount.chatCount : 0,
      };
    });
   
	  return {
	    statusCode: 201,
	    department: output,
	    message: "All Departments fetched successfully",
	  };
	} catch (err) {
	  console.error("Error getting Group", err);
	  throw new Error("Error getting Group");
	}
   };