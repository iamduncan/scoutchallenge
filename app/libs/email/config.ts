import formData from "form-data";
import Mailgun from "mailgun.js";
export const config = {
  baseURL: "https://api.sendinblue.com/v3",
};

export const mg = () => {
  const mailGunKey = process.env.MAILGUN_API_KEY;
  const mailGunDomain = process.env.MAILGUN_DOMAIN;
  if (mailGunKey && mailGunDomain) {
    const mg = new Mailgun.default(formData);
    return mg.client({
      key: mailGunKey,
      username: "api",
      url: "https://api.eu.mailgun.net",
    });
  } else {
    throw new Error("MAILGUN_API_KEY or MAILGUN_DOMAIN is not defined");
  }
};
