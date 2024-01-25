import { dataSource } from "../configs/dbConfig";
import { Chat } from "../entity/Chat";
import { Customer } from "../entity/Customer";
import { Department } from "../entity/Department";

export const createCustomer = async (
  name: string,
  email: string,
  mobileNo: string,
  dept_id: number,
): Promise<{
  statusCode: number;
  customer?: Customer | null;
  chat?: Chat | null;
  message: string;
}> => {
  try {
    const customerRepository = dataSource.getRepository(Customer);
    const chatRepository = dataSource.getRepository(Chat);
    const departmentRepository = dataSource.getRepository(Department);

    const customer: Customer | null = await customerRepository.findOne({
      where: { email: email },
    });

    if (customer !== null) {

	const chat = await chatRepository.findOne({
		where: { customer: { id: customer.id } },
		relations: ["department"],
	   });
	   
	return {
		statusCode: 200,
		customer: customer,
		chat: chat,
		message: "Customer exist already",
	   };
    }

    const newCustomer = customerRepository.create({ name, email, mobileNo });
    await customerRepository.save(newCustomer);

    const department: Department | null = await departmentRepository.findOne({
	where: { id:dept_id },
   });

    const chat = chatRepository.create({ customer: newCustomer, department: department, status: "Init", representative: null});
    await chatRepository.save(chat);

    return {
      statusCode: 201,
      customer: newCustomer,
	 chat: chat,
      message: "Customer created is successful",
    };
  } catch (err) {
    console.error("Error creating Category", err);
    throw new Error("Error creating Category");
  }
};
