import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "duncan.brown@wessexdigitalsolutions.co.uk";
  const groupEmail = "iamduncanbrown@gmail.com";
  const groupName = "Warminster Scout Group";
  const sectionName = "Scouts";

  // cleanup the existing database
  await prisma.user.deleteMany({}).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.group.deleteMany({}).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.section.deleteMany({}).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.challenge.deleteMany({}).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.challengeSection.deleteMany({}).catch(() => {
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

  const group = await prisma.group.create({
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

  const section = await prisma.section.create({
    data: {
      name: sectionName,
      group: {
        connect: {
          id: group.id,
        },
      },
      users: {
        connect: [
          {
            id: groupUser.id,
          },
        ],
      },
    },
  });

  // const challengeSections: Prisma.ChallengeSectionCreateNestedManyWithoutChallengeInput =
  //   {
  //     create: [
  //       {
  //         title: "My first challenge section",
  //         description:
  //           '{"_nodeMap":[["root",{"__children":["1"],"__dir":"ltr","__format":0,"__indent":0,"__key":"root","__parent":null,"__type":"root"}],["1",{"__type":"paragraph","__parent":"root","__key":"1","__children":["11"],"__format":0,"__indent":0,"__dir":"ltr"}],["11",{"__type":"text","__parent":"1","__key":"11","__text":"My first challenge section.","__format":0,"__style":"","__mode":0,"__detail":0}]],"_selection":{"anchor":{"key":"11","offset":31,"type":"text"},"focus":{"key":"11","offset":31,"type":"text"},"type":"range"}}',
  //         order: 0,
  //         questions: {
  //           create: [
  //             {
  //               title: "My first question",
  //               order: 0,
  //               type: "TEXT",
  //               description: "My first question description",
  //               hint: "My first question hint",
  //             },
  //             {
  //               title: "My second question",
  //               order: 1,
  //               type: "TEXT",
  //               description: "My second question description",
  //               hint: "My second question hint",
  //             },
  //             {
  //               title: "My third question",
  //               order: 2,
  //               type: "TEXT",
  //               description: "My third question description",
  //               hint: "My third question hint",
  //             },
  //           ],
  //         },
  //       },
  //       {
  //         title: "My second challenge section",
  //         description:
  //           '{"_nodeMap":[["root",{"__children":["1"],"__dir":"ltr","__format":0,"__indent":0,"__key":"root","__parent":null,"__type":"root"}],["1",{"__type":"paragraph","__parent":"root","__key":"1","__children":["11"],"__format":0,"__indent":0,"__dir":"ltr"}],["11",{"__type":"text","__parent":"1","__key":"11","__text":"My second challenge section.","__format":0,"__style":"","__mode":0,"__detail":0}]],"_selection":{"anchor":{"key":"11","offset":31,"type":"text"},"focus":{"key":"11","offset":31,"type":"text"},"type":"range"}}',
  //         order: 1,
  //         questions: {
  //           create: [
  //             {
  //               title: "My first question",
  //               order: 0,
  //               type: "TEXT",
  //               description: "My first question description",
  //               hint: "My first question hint",
  //             },
  //             {
  //               title: "My second question",
  //               order: 1,
  //               type: "TEXT",
  //               description: "My second question description",
  //               hint: "My second question hint",
  //             },
  //             {
  //               title: "My third question",
  //               order: 2,
  //               type: "TEXT",
  //               description: "My third question description",
  //               hint: "My third question hint",
  //             },
  //           ],
  //         },
  //       },
  //       {
  //         title: "My third challenge section",
  //         description:
  //           '{"_nodeMap":[["root",{"__children":["1"],"__dir":"ltr","__format":0,"__indent":0,"__key":"root","__parent":null,"__type":"root"}],["1",{"__type":"paragraph","__parent":"root","__key":"1","__children":["11"],"__format":0,"__indent":0,"__dir":"ltr"}],["11",{"__type":"text","__parent":"1","__key":"11","__text":"My third challenge section.","__format":0,"__style":"","__mode":0,"__detail":0}]],"_selection":{"anchor":{"key":"11","offset":31,"type":"text"},"focus":{"key":"11","offset":31,"type":"text"},"type":"range"}}',
  //         order: 2,
  //         questions: {
  //           create: [
  //             {
  //               title: "My first question",
  //               order: 0,
  //               type: "TEXT",
  //               description: "My first question description",
  //               hint: "My first question hint",
  //             },
  //             {
  //               title: "My second question",
  //               order: 1,
  //               type: "TEXT",
  //               description: "My second question description",
  //               hint: "My second question hint",
  //             },
  //             {
  //               title: "My third question",
  //               order: 2,
  //               type: "TEXT",
  //               description: "My third question description",
  //               hint: "My third question hint",
  //             },
  //           ],
  //         },
  //       },
  //     ],
  //   };

  // await prisma.challenge.create({
  //   data: {
  //     name: "My first challenge",
  //     introduction:
  //       '{"_nodeMap":[["root",{"__children":["1"],"__dir":"ltr","__format":0,"__indent":0,"__key":"root","__parent":null,"__type":"root"}],["1",{"__type":"paragraph","__parent":"root","__key":"1","__children":["11"],"__format":0,"__indent":0,"__dir":"ltr"}],["11",{"__type":"text","__parent":"1","__key":"11","__text":"My first challenge introduction.","__format":0,"__style":"","__mode":0,"__detail":0}]],"_selection":{"anchor":{"key":"11","offset":31,"type":"text"},"focus":{"key":"11","offset":31,"type":"text"},"type":"range"}}',
  //     group: {
  //       connect: {
  //         id: group.id,
  //       },
  //     },
  //     sections: {
  //       connect: [
  //         {
  //           id: section.id,
  //         },
  //       ],
  //     },
  //     challengeSections,
  //     createdBy: {
  //       connect: {
  //         id: groupUser.id,
  //       },
  //     },
  //     updatedBy: {
  //       connect: {
  //         id: groupUser.id,
  //       },
  //     },
  //   },
  //   include: {
  //     challengeSections: true,
  //   },
  // });

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
