import { checkDocker } from "./src/shared/scripts/checkDocker";
import { execSync } from "child_process";
import path from "path";

export const prepareDev = (env = ".env.development"): void => {
  const packageRoot = path.resolve(__dirname);
  const execParams = {
    cwd: packageRoot,
    stdio: "inherit",
  } as const;

  console.log(`Preparing dev environment using ${env}`);

  checkDocker();

  execSync("docker volume create nats1", execParams);
  execSync("docker volume create nats2", execParams);
  execSync("docker volume create nats3", execParams);

  execSync("docker-compose up --build -d", execParams);
  execSync("prisma generate --schema prisma/schema.prisma", execParams);
  execSync(`dotenv -e ${env} -- npm run migrate`, execParams);
};
