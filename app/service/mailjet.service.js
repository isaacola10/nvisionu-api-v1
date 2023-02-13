const config = require('../../config')
const MailJet = require('node-mailjet')

const mailjet = new MailJet({
  apiKey: config.mailjet.key,
  apiSecret: config.mailjet.secret
})

const SEND_MAIL = async (content) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: config.mail.from,
          Name: config.mail.name,
        },
        To: [
          {
            Email: content.email,
          },
        ],
        TemplateID: content.templateID,
        TemplateLanguage: true,
        Subject: content.subject,
        Variables: content.variables,
      },
    ],
  });

  return await request;
};

module.exports = { SEND_MAIL };