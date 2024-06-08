const apiUrl = process.env.API_URL ?? "";

const config = {
  api: {
    url: apiUrl,
    port: 3000,
    allowedOrigins: [
      "http://localhost:5173",
      "http://192.168.21.100:5173",
      "http://192.168.64.1:4173",
    ],
  },
  frontend: {
    completeProfile: process.env.COMPLETE_PROFILE_URL ?? "",
    loginUrl: process.env.LOGIN_URL ?? "",
  },
};

export { config };
