import nodemailer from "nodemailer"

const mailer = nodemailer.createTransport({
	host: "in-v3.mailjet.com",
	secure: true,
	port: 465,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
})

export default mailer
