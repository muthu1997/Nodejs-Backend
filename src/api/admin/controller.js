import { Router } from "express";
import Admin from "./model";
import Institutions from '../institutions/model';
const bcrypt = require("bcryptjs");
import { sign, verify } from "../../services/jwt";
import Tokens from "../tokens/model";
import SubscriptionDetails from '../subscription/model-mappings';
import moment from "moment";
import { emailVerifcationEmail, resetAdminPasswordMail } from "../../services/email/email";
import { format } from "path";

export const getAdminDetails = async (req, res) => {
  try {
    const AdminDatas = await Admin.find({});
    res.send({
      success: true,
      status: 200,
      message: "Admin Success",
      data: AdminDatas.map((val) => val.view()),
    });
  } catch (error) {
    res.send({ success: false, status: 404, message: "Admin Failed" });
  }
};

export const signin = async (req, res, next) => {
  try {
    const userAdmin = await Admin.findOne({ emailid: req.body.emailid.replace(/^([\w-\.]\+\@([\w-]+\.)+[\w-]{2,4})?$/i), usertype: req.body.usertype });
    const userClient = await Institutions.findOne({ emailid: req.body.emailid.replace(/^([\w-\.]\+\@([\w-]+\.)+[\w-]{2,4})?$/i) });
    const user = req.body.usertype == 'product_admin' ? userAdmin : userClient;
    if (user) {
      if (user) {
        const subscription_status = [];
        subscription_status.length = 0;
        if (req.body.usertype == 'client_admin') {
          const subscription_Details = await SubscriptionDetails.findOne({ user_id: user.view().id, status: 'active' });
          if (subscription_Details) {
            var a = moment(subscription_Details.view().end_date).format('YYYY-DD-MMTHH:mm:ss[Z]');
            var b = moment().utcOffset(0);
            b.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            b.toISOString()
            b.format()
            var diffDays = b.diff(a, 'days');
            if (diffDays > 0) {
              // expired
              subscription_status.push(false)
              const query = { '_id': subscription_Details.view().id };
              const subscription_Data_Update = {
                status: "inactive",
              };
              await SubscriptionDetails.findOneAndUpdate(query, subscription_Data_Update)
            } else {
              // active
              subscription_status.push(true)
            }
          } else {
            subscription_status.push(false)
          }
        } else {
          subscription_status.push("")
        }
        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        if (validatePassword) {
          sign({ id: user["_id"], userType: req.body.usertype }, (errSign, responseSign) => {
            if (!errSign) {
              user.token = responseSign;
              res.send({
                success: true,
                status: 200,
                message: "Login success",
                data: {
                  id: user.view().id,
                  name: user.view().name,
                  emailid: user.view().emailid,
                  address: user.view().address,
                  usertype: req.body.usertype,
                  subscription: subscription_status[0]
                },
                token: user.token,
              });
            }
          });
        } else {
          res
            .status(404)
            .send({
              success: false,
              status: res.status,
              message: "Email and password combination not match",
            });
        }
      } else {
        res
          .status(400)
          .send({
            success: false,
            status: res.status,
            message: "Email not verified. Please use resend OTP Email Verification",
          });
      }
    } else {
      res
        .status(404)
        .send({ success: false, status: res.status, message: `${req.body.emailid} is not registered.` });
    }
  } catch (error) {
    res.status(404).send({ success: false, status: res.status, message: "Signin failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const userAdmin = await Admin.findOne({
      emailid: req.body.emailid.replace(/^([\w-\.]\+\@([\w-]+\.)+[\w-]{2,4})?$/i),
      usertype: req.body.usertype,
    });
    const userClient = await Institutions.findOne({
      emailid: req.body.emailid.replace(/^([\w-\.]\+\@([\w-]+\.)+[\w-]{2,4})?$/i),
    });
    const user = req.body.usertype === 'product_admin' ? userAdmin : userClient;
    if (user) {
      const otpData = Math.floor(100000 + Math.random() * 900000);
      const token = await Tokens.create({
        emailid: user.emailid,
        userid: user["_id"],
        otp: otpData,
        usertype: req.body.usertype,
        type: req.body.usertype === 'product_admin' ? "forgot_password_admin" : "forgot_password_client",
        expiry: moment().add(30, "minutes"),
      });

      resetAdminPasswordMail({ email: user.emailid, otp: otpData, usertype: req.body.usertype });
      res.send({
        success: true,
        status: 200,
        message: `Email Sent to '${user.emailid}'. Please enter the code in mail to complete verification`,
        data: { emailid: user.emailid },
        token: token._id
      });
    } else {
      res.status(400).send({ success: false, status: res.status, message: "User not registered" });
    }
  } catch (error) {
    res.status(404).send({ success: false, status: res.status, message: "Forgot password failed" });
  }
};

export const forgotPasswordTokenVerification = async (req, res, next) => {
  try {
    const token_finder = await Tokens.find({ _id: req.query.token });
    const userid = token_finder[0].userid;
    const token = await Tokens.findOne({
      _id: req.query.token,
      userid: userid,
      otp: req.query.otp,
      status: "Pending",
      expiry: { $gt: moment() },
    }).sort({ _id: -1 });

    const newToken = await Tokens.create({
      userid: userid,
      usertype: token.usertype,
      type: token.type,
      existingid: req.query.token,
      expiry: moment().add(30, "minutes"),
    });

    const expiry = moment(token_finder[0].expiry);
    const current_time = moment.utc();
    const token_validation = expiry.diff(current_time, "minutes");
    const output_data = { userid: token.userid, usertype: token.usertype };
    // if(token_validation >= 0 && token_validation !== "Invalid Token") {
    //   await Tokens.findOneAndUpdate({_id: req.query.token},{$set: {"status": "Completed"}});
    // }
    res.send({
      success: true,
      status: 200,
      message: token_validation >= 0 ? "Valid Token" : "Invalid Token",
      data: token_validation >= 0 ? output_data : null,
      token: newToken._id
    });
  } catch (error) {
    res.status(404).send({ success: false, status: 404, message: "Token Verification failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token_finder = await Tokens.find({ _id: req.body.token, status: "Pending", });
    const userid = token_finder[0].userid;
    const user_type = token_finder[0].usertype;
    const user = user_type == 'product_admin' ? await Admin.findOne({ _id: userid }) : await Institutions.findOne({ _id: userid });;
    if (user) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const user = user_type == 'product_admin' ? await Admin.findOneAndUpdate({ _id: userid }, { $set: { password: hashPassword } }) : await Institutions.findOneAndUpdate({ _id: userid }, { $set: { password: hashPassword } });
      await Tokens.findOneAndUpdate({ _id: req.body.token }, { $set: { "status": "Completed" } });
      res.send({ success: true, status: 200, message: "Password changed successfully" });
    } else {
      res.status(200).send({ success: false, status: 200, message: "Invalid user" });
    }
  } catch (error) {
    res.status(404).send({ success: false, status: res.status, message: "Change password failed" });
  }
};

export const regeneratetoken = async (req, res) => {
  try {
    const headertoken = req.headers.authorization.split(" ")[1];
    const data = await verify(headertoken);
    const usertype = data.userType;
    const user = usertype == 'product_admin' ? await Admin.findOne({ _id: data.id }) : await Institutions.findOne({ _id: data.id });
    const subscription_Details = await SubscriptionDetails.findOne({ user_id: user.view().id, status: 'active' });

    const subscription_status = [];
    subscription_status.length = 0;
    if (subscription_Details) {
      var a = moment(subscription_Details.view().end_date).format('YYYY-DD-MMTHH:mm:ss[Z]');
      var b = moment().utcOffset(0);
      b.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      b.toISOString()
      b.format()
      var diffDays = b.diff(a, 'days');
      if (diffDays > 0) {
        // expired
        subscription_status.push(false)
        const query = { '_id': subscription_Details.view().id };
        const subscription_Data_Update = {
          status: "inactive",
        };
        await SubscriptionDetails.findOneAndUpdate(query, subscription_Data_Update)
      } else {
        // active
        subscription_status.push(true)
      }
    } else {
      subscription_status.push(false)
    }
    // const user = await Admin.findOne({ _id: data.id });
    // res.send({ success: true, status: 200, message: 'Token Regeneration Success', data: user});
    sign({ id: data.id, userType: user.usertype == 'product_admin' ? user.usertype : 'client_admin' }, (errSign, responseSign) => {
      if (!errSign) {
        const token = responseSign;
        res.send({
          success: true,
          status: 200,
          message: "Token Regeneration Success",
          token: token,
          usertype123: user.usertype == 'product_admin' ? user.usertype : 'client_admin',
          data: {
            id: user.id,
            name: user.name,
            emailid: user.emailid,
            address: user.address,
            usertype: user.usertype == 'product_admin' ? user.usertype : 'client_admin',
            subscription: subscription_status[0]
          },
        });
      }
    });
  } catch (error) {
    res.status(404).send({ success: false, status: 404, message: "Token Regeneration Failed" });
  }
};

export const logout = async (req, res) => {
  try {
    const headertoken = req.headers.authorization.split(" ")[1];
    res.send({ success: true, status: 200, message: "Logout Success" });
  } catch (error) {
    res.status(404).send({ success: false, status: 404, message: "Bad Request", error: "Logout Failed" });
  }
};
