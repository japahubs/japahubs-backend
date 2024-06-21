import dotenv from "dotenv";

dotenv.config();

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
    completeProfile: `${process.env.FRONTEND_URL}/auth/signup-personalized` ?? "",
    homeUrl: process.env.FRONTEND_URL ?? "",
  },
};

export { config };
