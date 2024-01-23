import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "admin1234",
  database: "chat-app",
  entities: ["src/entity/*.ts"],
  logging: false,
  synchronize: true,
});
