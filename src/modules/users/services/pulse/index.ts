import  { prisma } from "../../../../shared/infra/persistence"

async function main() {
  const stream = await prisma.users.stream({ name: 'user-stream'})

  for await (const event of stream) {
    console.log('New event:', event)
  }
}

main()