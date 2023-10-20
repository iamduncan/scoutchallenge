import { config } from "./config.ts";

export type TMessage = {
  sender: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  htmlContent?: string;
  textContent?: string;
  subject?: string;
  replyTo: {
    name?: string;
    email: string;
  };
  templateId?: number;
  params?: { [key: string]: any };
  attachment?: {
    url?: string;
    content?: string;
    name?: string;
  }[];
  headers?: { [key: string]: any };
  tags?: string[];
};

export const SendMessage = async (message: TMessage) => {
  const sibApiKey = process.env.SENDINBLUE_API_KEY;
  if (!sibApiKey) {
    throw new Error("SENDINBLUE_API_KEY is not defined");
  }

  try {
    const messageId = await fetch(`${config.baseURL}/smtp/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": sibApiKey,
      },
      body: JSON.stringify(message),
    });
    return messageId;
  } catch (error) {
    console.error(error);
  }
};
