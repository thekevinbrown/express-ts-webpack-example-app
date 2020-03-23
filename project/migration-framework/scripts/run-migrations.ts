import { runMigrations } from "../run-migrations";

runMigrations()
  .catch(error => {
    console.error(error);
  })
  .then(() => {
    console.log("Success");
  });
