const apiUrl = process.env.API_URL ?? "";

const config = {
  api: {
    url: apiUrl,
    port: 3000,
  },
  frontend: {
    completeProfile: process.env.COMPLETE_PROFILE_URL ?? "",
  },
};

export { config };
