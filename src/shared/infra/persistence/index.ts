import { PrismaClient } from '@prisma/client'
import { withPulse } from '@prisma/extension-pulse'

const prisma = new PrismaClient()
  .$extends(
    withPulse({
      apiKey: process.env.PULSE_API_KEY as string
    })
  )

  type PrismaClientWithPulse = typeof prisma;

export {prisma, PrismaClientWithPulse}