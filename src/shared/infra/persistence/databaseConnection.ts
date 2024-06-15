import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class Database {
  async testConnection(): Promise<boolean> {
    try {
      // Perform a simple query to test the database connection
      const users = await prisma.users.findMany();
      const posts = await prisma.posts.findMany();
      console.log("Connected to the database successfully.");
      console.log("Users:", users);
      console.log("Posts:", posts);
      return true;
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      return false;
    }
  }
}
