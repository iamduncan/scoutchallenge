import Mailgun from "mailgun-js";
export const config = {
  baseURL: "https://api.sendinblue.com/v3",
};

export const mg = () => {
  const mailGunKey = process.env.MAILGUN_API_KEY;
  const mailGunDomain = process.env.MAILGUN_DOMAIN;
  if (mailGunKey && mailGunDomain) {
    const mg = Mailgun({
      apiKey: mailGunKey,
      domain: mailGunDomain,
      host: "api.eu.mailgun.net",
    });
    return mg;
  } else {
    throw new Error("MAILGUN_API_KEY or MAILGUN_DOMAIN is not defined");
  }
};
