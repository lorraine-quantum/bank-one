const nodemailer = require("nodemailer");
require("dotenv").config();
// async..await is not allowed in global scope, must use a wrapper
async function sendMailAdmin(level, email, fullname, link) {
  try {
    console.log("sending mail to " + email)
    console.log("" + link)
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"admin@Elite" support@elitefinancialhub.org',
      to: email, // list of receivers
      subject: `Hello Admin`, // Subject line
      text: "Hello", // plain text body
      html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Elite Financial Banking</title>
  <style type="text/css">
    
  
  body {
      margin: 0;
      font-size:20px;
      background-color: #cccccc;
    }

    table {
      border-spacing: 0;
    }

    td {
      padding: 0;
    }

    img {
      border: 0;
    }

    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #cccccc;
      padding-bottom: 60px;
    }

    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: sans-serif;
      color: #4a4a4a;
    }

    .one-column {
      text-align: center;
      font-size: 0;
    }

    .one-column .column {
      width: 100%;
      max-width: 300%;
      vertical-align: top;
    }

    .two-columns {
      text-align: center;
      font-size: 0;
    }

    .two-columns .column {
      width: 100%;
      max-width: 300%;
      display: inline-block;
      vertical-align: top;
    }

    .button {
      background-color: #289dcf;
      padding: 10px 20px;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }

    ol {
      margin-bottom: 24px;
    }

    ol li {
      margin-bottom: 14px;
    }
  </style>
</head>

<body>
  <center class="wrapper">
    <table class="main" width="100%">
      <!-- BANNER IMAGE -->
      <tr>
        <td>
            <img src="https://i.ibb.co/FhCzjSn/email-banner.webp" alt="" width="600px" style="max-width: 100%" />
        </td>
      </tr>

      <!-- TITLE, TEXT & BUTTON -->
      <tr>
        <td style="padding: 5px 0 50px">
          <table width="100%">
            <tr>
              <td style="text-align: start; padding: 15px">
                <p style="font-size: 24px; font-weight: bold">
                  Dear Admin,
                </p>
                <br />
                  
                <p style="line-height: 24px;">
                    This is an automated notification to inform you that ${fullname} has just submitted the correct OTP pending withdrawal ${level}. Please proceed
                    accordingly
                      <br>
                      <br>
                      Click on the button bellow to proceed to the dashboard.
                </p>

                </p>
                </p>

            <tr>
              <td style="padding: 15px;">
                <table width-="100%">
                  <tr>
                    <td>
                      <a href=${link} class="button">Open dashboard</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

        </td>
      </tr>
    </table>
    </td>
    </tr>

    <!-- FOOTER SECTION -->
    
        </table>
      </td>
    </tr>
    </table>
  </center>
</body>

</html>`,

    });

    return info.messageId
  } catch (error) {
    console.error(error)
  }
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


module.exports = { sendMailAdmin }