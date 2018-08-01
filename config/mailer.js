module.exports = {
	from: 'no-reply@matcha.com',
	host: 'smtp.gmail.com',		// hostname
	secureConnection: true,		// use SSL
	port: 465,					// port for secure SMTP
	transportMethod: 'SMTP',	// default is SMTP. Accepts anything that nodemailer accepts
	auth: {
	  user: 'rtarasen.matcha@gmail.com',
	  pass: 'AAA-ghbdtn123-AAA'
	}
};