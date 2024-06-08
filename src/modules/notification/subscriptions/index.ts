import { startNats } from "../../../shared/infra/broker/nats/startNats";

import { UserListener } from "./listeners/user-listener";

async function setupListeners() {
  const client = (await startNats("notification module"))!;

  await new UserListener(client).listen();
}

setupListeners();

