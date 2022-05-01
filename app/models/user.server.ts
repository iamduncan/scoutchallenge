import type { Group, Password, Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import mailgun from "mailgun-js";

import { prisma } from "~/db.server";
import { mg } from "~/libs/email/config";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id }, include: { groups: true } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  email: User["email"],
  password: string,
  firstName: User["firstName"],
  lastName: User["lastName"],
  group?: Group["name"],
  role?: User["role"]
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
      firstName,
      lastName,
      groups: group ? { create: { name: group } } : undefined,
      role,
    },
  });
}

export async function updateUser(
  id: User["id"],
  data: Prisma.UserUpdateWithoutPasswordInput
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function updateUserPassword(
  id: User["id"],
  password: string,
  tokenId?: string
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
  password: Password["hash"]
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
    userWithPassword.password.hash
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
    },
  });

  await mg()
    .messages()
    .send(
      {
        from: "Scout Challenge Auth <auth@scoutchallenge.app>",
        to: email,
        subject: "Reset your Scout Challenge password",
        text: `You have requested to reset your Scout Challenge password.

        Please click the following link to reset your password:
        https://scoutchallenge.app/reset-password/${token.token}

        If you did not request to reset your password, please ignore this email.`,
      },
      (err, body) => {
        if (err) {
          console.error(err);
        }
      }
    );

  return user;
};

export const tokenIsValid = async (token: string) => {
  const tokenRecord = await prisma.token.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });

  if (!tokenRecord) {
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
    const subscriber = await mg().lists(subscriberList).members().create({
      name,
      address,
      subscribed: true,
    });
    return subscriber;
  } catch (error) {
    console.error(error);
  }
};
