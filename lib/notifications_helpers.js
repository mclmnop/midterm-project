
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sgMail = require('@sendgrid/mail');
const client = require('twilio')(accountSid, authToken);

const sendEmailNewMessage = function(receiver){
  const msg = {
    to: 'tesalov311@naymeo.com',
    from: 'mc.lhl2021@gmail.com',
    subject: 'New message Inbox ',
    text: 'Please connect to your account',
    html: `<strong>Hello, You got a new message in your Vend acount, please connect</strong>`,
  };
   return sgMail.send(msg);
}

const sendSMSNewMessage = function(receiver){
  return client.messages
  .create({
    to: '+15144338832',
    from: '+14388003069',
    body: `Hello, You got a new message in your Vend acount, please connect`,
  });
}

module.exports = { sendEmailNewMessage, sendSMSNewMessage };
