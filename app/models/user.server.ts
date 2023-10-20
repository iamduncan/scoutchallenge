import type { Group, Password, Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "#app/utils/db.server.ts";
import { mg } from "#app/libs/email/config.ts";

export type { User, Token } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    include: { groups: true, sections: true, roles: true },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function listUsers({
  limit = 10,
  offset = 0,
  orderBy = { createdAt: "desc" },
  where = {},
}: {
  limit?: number;
  offset?: number;
  orderBy?: Prisma.UserOrderByWithRelationInput;
  where?: Prisma.UserWhereInput;
} = {}) {
  return prisma.user.findMany({
    take: limit,
    skip: offset,
    orderBy,
    where,
    select: {
      id: true,
      name: true,
      groups: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function createUser(
  username: User["username"],
  email: User["email"],
  password: string,
  name: User["name"],
  group?: Group["name"],
  role?: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      username,
      name,
      groups: group ? { create: { name: group } } : undefined,
      roles: {
        create: role ? { name: role } : undefined,
      },
    },
  });
}

export async function updateUser(
  id: User["id"],
  data: Prisma.UserUpdateWithoutPasswordInput,
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function updateUserPassword(
  id: User["id"],
  password: string,
  tokenId?: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = prisma.user.update({
    where: { id },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });

  if (tokenId) {
    deleteToken(tokenId);
  }

  return user;
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function deleteToken(id: string) {
  return prisma.token.delete({ where: { id } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export const sendPasswordReset = async (email: User["email"]) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return null;
  }

  const token = await prisma.token.create({
    data: {
      user: {
        connect: {
          email,
        },
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  try {
    const mailGunDomain = process.env.MAILGUN_DOMAIN || "";
    await mg().messages.create(mailGunDomain, {
      from: "Scout Challenge Auth <auth@scoutchallenge.app>",
      to: email,
      subject: "Reset your Scout Challenge password",
      text: `You have requested to reset your Scout Challenge password.

        Please click the following link to reset your password:
        https://scoutchallenge.app/reset-password/${token.token}

        This link will expire in 24 hours.

        If you did not request to reset your password, please ignore this email.`,
    });
  } catch (err) {
    console.error(err);
  }

  return user;
};

export const listTokens = async () => {
  return prisma.token.findMany({
    select: {
      id: true,
      token: true,
      createdAt: true,
      expiresAt: true,
      user: {
        select: {
          username: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const tokenIsValid = async (token: string) => {
  const tokenRecord = await prisma.token.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });

  if (!tokenRecord || !tokenRecord.expiresAt) {
    return false;
  }

  const expireAt = new Date(tokenRecord.expiresAt);
  if (expireAt < new Date()) {
    return false;
  }

  const { user } = tokenRecord;

  if (!user) {
    return false;
  }

  return tokenRecord;
};

export const addSubscriber = async (name: string, address: string) => {
  const subscriberList = process.env.MAILGUN_SUBSCRIBER_LIST;
  if (!subscriberList) {
    console.error("MAILGUN_SUBSCRIBER_LIST is not set");
    return;
  }
  try {
    const subscriber = await mg().lists.members.createMember(subscriberList, {
      name,
      address,
      subscribed: true,
    });
    return subscriber;
  } catch (error) {
    console.error(error);
  }
};

export const removeSubscriber = async (address: string) => {
  const subscriberList = process.env.MAILGUN_SUBSCRIBER_LIST;
  if (!subscriberList) {
    console.error("MAILGUN_SUBSCRIBER_LIST is not set");
    return;
  }
  try {
    const subscriber = await mg().lists.members.destroyMember(
      subscriberList,
      address,
    );
    return subscriber;
  } catch (error) {
    console.error(error);
  }
};
