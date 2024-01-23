import startServer from "./app";

const port = 3001;

async function start(): Promise<void> {
  try {
    await startServer(port);
    console.log("Server started!");
  } catch (err) {
    console.error("Something went wrong!", err);
  }
}

start().catch((err) => {
  console.error(err);
});
