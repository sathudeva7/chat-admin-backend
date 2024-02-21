import nodemailer from 'nodemailer';

interface Email {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(email: Email): Promise<void> {
  const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  type: 'OAuth2',
	  user: process.env.MAIL_USERNAME,
	  pass: process.env.MAIL_PASSWORD,
	  clientId: process.env.OAUTH_CLIENTID,
	  clientSecret: process.env.OAUTH_CLIENT_SECRET,
	  refreshToken: process.env.OAUTH_REFRESH_TOKEN
	}
   });

  return new Promise<void>((resolve, reject) => {
    transporter.sendMail(email, (error, info) => {
      if (error) {
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve();
      }
    });
  });
}
