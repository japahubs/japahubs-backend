const apiUrl = process.env.API_URL ?? "";
const frontendUrl = process.env.FRONTEND_URL ?? "";

const config = {
  api: {
    url: apiUrl,
    port: 3000,
  },
  frontend: {
    url: frontendUrl,
    port: 3001,
  },
};

export { config };
