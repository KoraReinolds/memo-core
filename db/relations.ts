import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getLinks(groupId: number) {
  const links = await prisma.list.findMany({
    where: {
      groupId,
    },
    select: {
      items: {
        select: {
          linkTo: {
            select: {
              itemId: true,
              relatedId: true,
            },
          },
        },
      },
    },
  })

  const items = links.flatMap((entry) => entry.items)

  return items.flatMap((entry) => entry.linkTo)
}

async function saveNewLinks(data: [number, number][]) {
  const count = await prisma.relation.createMany({
    data: data.map((pair) => ({
      itemId: pair[0],
      relatedId: pair[1],
    })),
  })

  return count
}

async function deleteLinks(data: [number, number][]) {
  const count = await prisma.relation.deleteMany({
    where: {
      OR: data.map((pair) => ({
        itemId: pair[0],
        relatedId: pair[1],
      })),
    },
  })

  return count
}

export { getLinks, saveNewLinks, deleteLinks }
