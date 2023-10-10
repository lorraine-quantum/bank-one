const nodemailer = require("nodemailer");
require("dotenv").config();
// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email, fullname, link, accountNumber, address, phoneNumber) {
  try {
    console.log("sending mail")
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
      from: '"EFB support" support@elitefinancialhub.org',
      to: email, // list of receivers
      subject: `Hello ${fullname}`, // Subject line
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
                <p style="font-size: 24px;  font-weight: bold">
                  Dear ${fullname}
                </p>
                <p style="
                      padding: 5px 0;
                      line-height: 24px;
                    ">
                  We are thrilled to welcome you to Elite Financial Banking,
                  where managing your finances has never been easier or more
                  convenient. Thank you for choosing us as your trusted
                  banking partner.
                </p>
                  <br/>
                  <br/>
                  <p
              data-id="react-email-text"
              style="font-size:20px;   margin: 16px 0"
            >
              Here are the details we have on file for you:
            </p>

            <ul>
              <li style="margin-bottom: 0.5rem">
                Customer Name: ${fullname}
              </li>
              <li style="margin-bottom: 0.5rem">
                Email Address: ${email}
              </li>
              <li style="margin-bottom: 0.5rem">
                Residential Address: ${address}
              </li>
              <li style="margin-bottom: 0.5rem">
                Phone Number: ${phoneNumber}
              </li>
              <li style="margin-bottom: 0.5rem">
                Account Number: ${accountNumber}
              </li>
            </ul>
                  <br />
                  
                <p style="line-height: 24px;">

                      Your new Online Banking account is your gateway to a world
                      of financial possibilities, and we're here to provide you
                      with secure and efficient banking services around the clock.
                      Here are a few key features to get you started:
                </p>

                <ol style="line-height: 24px;">
                  <li>
                   <strong>Account Overview</strong>: Quickly view your account balances, recent
                    transactions, and account history.
                  </li>
                  <li>
                    <strong>Transfers</strong>: Transfer funds
                    between your accounts or send money to other accounts within
                    Elite Financial Banking or external institutions.
                  </li>
                  <li>
                    <strong>Security</strong>: We prioritize the security of your accounts. Rest assured that your information is
                    protected with state-of-the-art encryption and security measures.
                  </li>
                </ol>
                <p style="line-height: 24px;">
                    To access your Online Banking account, simply click on the link below and follow the easy instructions:
                </p>
                </p>

            <tr>
              <td style="padding: 15px;">
                <table width-="100%">
                  <tr>
                    <td>
                      <a href=${link} class="button">Verify Your Account</a>
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


module.exports = { sendMail }
