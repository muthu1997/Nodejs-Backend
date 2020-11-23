import { API_URL } from '../../../config';

export const emailVerify = (otp) => {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      body {
        background-color: #f3f3f3;
      }
  
      .button {
        background-color: rgba(148, 11, 202, 0.993);
        border: none;
        color: white;
        padding: 15px 32px;
        text-decoration: none;
        display: flex;
        margin-right: 50px;
  
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        width: 200px;
      }
  
      .centers {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
        margin-top: 30px;
      }
  
      div {
        width: auto;
      }
  
      .paragraph {
        font-size: 20px;
        padding: 10px 30px;
        text-align: center;
      }
  
      .email {
        padding: 10px;
        background-color: rgb(187, 16, 187);
        color: white;
      }
  
      .heading {
        align-items: center;
        color: #408892;
        font-size: 30px;
      }
  
      .monospace {
        font-family: "Lucida Console", Courier, monospace;
        font-size: 22px;
      }
  
      .emailline {
        width: 100px;
        height: 2px;
        border-width: 0;
        color: gray;
        background-color: gray
      }
  
      .otp {
        font-size: 40px;
        font-weight: 600;
        width: 300px;
        border: none;
        color: #408892;
        text-align: center;
        margin: 0px;
        margin-bottom: 20px;
      }
  
      line {
        width: 100px;
        height: 2px;
        border-width: 0;
        color: gray;
        background-color: gray
      }
  
      .logo {
        display: block;
        width: 100px;
        height: 100px;
        margin-top: 25px;
      }
  
      .name {
        color: #408892;
        font-size: 24px;
      }
  
      .footer {
        color: darkgrey;
        font-size: 20px;
      }
    </style>
  </head>
  
  <body>
  <div style="background-color: #f3f3f3;">
    <center style="max-width: 560px; margin: 0 auto">
      <div class="heading">
        <br />
        <h3 style="margin: 10px">Email verification</h3>
      </div>
  
      <div class="center">
        <div style="background-color: #ffffff; padding: 1px 0; box-shadow: -1px 4px -6px rgba(0, 0, 0, 0);border-radius: 10px;padding-bottom: 20px">
          <img src="${API_URL}/assets/logo.png" alt="image" width="150" height="200" class="centers" style="height: 100px;width: 100px;">
          <br />
          <!-- <hr class="line" style="margin:20px; background: red"> -->
          <h2 align='center' class="monospace">Verify Your Email</h2>
          <hr class="emailline">
          <p class="paragraph">In order to start using your CovidCheX App, you need to enter this OTP.</p>
          <a>
            <p class="otp">${otp}</p>
          </a>
          <div> It will expire after 30 minutes.</div>
        </div>
        <br />
        <div style="display:inline-block;">
          <!-- <img src="" alt="logo" class="logo"> -->
          <div>
            <h1 class="name">CovidCheX</h1>
            <h1 class="footer">TELEMEDIX</h1>
            <div>
            </div>
          </div>
        </div>
        <div>Please do not reply to this email. This mailbox is not monitored and you will not receive a response.</div>
      </div>
      <br />
    </center>
    </div>
  </body>
  
  </html>`
} 