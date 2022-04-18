import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "duncan.brown@wessexdigitalsolutions.co.uk";
  const groupEmail = "iamduncanbrown@gmail.com";
  const groupName = "Warminster Scout Group";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.user.delete({ where: { email: groupEmail } }).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.group.delete({ where: { name: groupName } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const adminHashedPassword = await bcrypt.hash("adminPassword", 10);
  const groupHashedPassword = await bcrypt.hash("groupPassword", 10);

  const adminUser = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: adminHashedPassword,
        },
      },
      firstName: "Duncan",
      lastName: "Brown",
      role: "ADMIN",
    },
  });

  const groupUser = await prisma.user.create({
    data: {
      email: groupEmail,
      password: {
        create: {
          hash: groupHashedPassword,
        },
      },
      firstName: "Duncan",
      lastName: "Brown",
      role: "GROUPADMIN",
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: adminUser.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: adminUser.id,
    },
  });

  await prisma.group.create({
    data: {
      name: groupName,
      users: {
        connect: [
          {
            id: groupUser.id,
          },
        ],
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
