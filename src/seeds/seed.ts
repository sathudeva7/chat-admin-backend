import { dataSource } from "../configs/dbConfig";
import { seedDepartmentData } from "./departmentSeed";
import { seedUserData } from "./userSeed";

dataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");

        await seedUserData();
	   await seedDepartmentData();

        // Call other seed functions as needed
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    })
    .finally(() => dataSource.destroy());
