const nodemailer = require("nodemailer");

async function main() {
  // 1. Create the transporter using Namecheap's settings
  const transporter = nodemailer.createTransport({
    host: "smtp.privateemail.com",
    port: 465, 
    secure: true, // true for port 465 (SSL)
    auth: {
      user: "info@hottubensauna.nl", // Your full email address
      pass: "Hertogjan1214!", // Your mailbox password
    },
  });

  try {
    // 2. Send the email
    const info = await transporter.sendMail({
      from: '"Test Bot" <info@hottubensauna.nl>', 
      to: "micjcameron@gmail.com", // Send to your personal Gmail to test
      subject: "Hello from my code! 🚀", 
      text: "If you're reading this, your DNS and SMTP settings are correct.", 
      html: "<b>If you're reading this, your DNS and SMTP settings are correct.</b>",
    });

    console.log("Message sent successfully! ID: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred while sending:", error.message);
  }
}

main();