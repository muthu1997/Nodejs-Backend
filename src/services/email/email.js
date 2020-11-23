import nodemailer from 'nodemailer'
import { MAIL_ADDRESS, MAIL_PASSWORD, MAIL_HOST, MAIL_PORT, MAIL_SECURE } from '../../config';
import { forgetpassword } from './Templates/forgetpassword';
import { forgetadminpassword } from './Templates/forgotadminpassword';
import { emailVerify } from './Templates/emailverification';
import { instituteVerify } from './Templates/instituteVerification';
import { instituteInvitation } from './Templates/institute_invitation';

let transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secureConnection: MAIL_SECURE,
    auth: {
        user: MAIL_ADDRESS,
        pass: MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

export const resetPasswordMail = (data) => {
    const message = {
        from: 'HealthCheck<healthCheck@healthCheck.com>',
        to: data.email,
        subject: `Reset Password - ${data.otp}(OTP)`,
        html: forgetpassword(data.otp, data.usertype)
    }

    transporter.sendMail(message, (error, info) => {
        if (error) {
            return console.log(error, info)
        } else {
            console.log(info)
            resolve({});
        }
    })
}

export const resetAdminPasswordMail = (data) => {
    const message = {
        from: 'HealthCheck<healthCheck@healthCheck.com>',
        to: data.email,
        subject: `Reset Password`,
        html: forgetadminpassword(data.otp, data.usertype)
    }

    transporter.sendMail(message, (error, info) => {
        if (error) {
            return console.log(error, info)
        } else {
            console.log(info)
            resolve({});
        }
    })
}


export const emailVerifcationEmail = (data) => {
    const message = {
        from: 'HealthCheck<healthCheck@healthCheck.com>',
        to: data.email,
        subject: `Email verification - ${data.otp}(OTP)`,
        html: emailVerify(data.otp)
    }

    transporter.sendMail(message, (error, info) => {
        if (error) {
            return console.log(error, info)
        } else {
            console.log(info)
            resolve({});
        }
    })
}

export const instituteVerifcationEmail = (data) => {
    const message = {
        from: 'HealthCheck<healthCheck@healthCheck.com>',
        to: data.email,
        subject: `Institute verification - ${data.otp}(OTP)`,
        html: instituteVerify(data.otp)
    }

    transporter.sendMail(message, (error, info) => {
        if (error) {
            return console.log(error, info)
        } else {
            console.log(info)
            resolve({});
        }
    })
}

export const instituteInvitationEmail = (data) => {
    const message = {
        from: 'HealthCheck<healthCheck@healthCheck.com>',
        to: data.email,
        subject: `Welcome to CovidCheX`,
        html: instituteInvitation(data.token)
    }

    transporter.sendMail(message, (error, info) => {
        if (error) {
            return console.log(error, info)
        } else {
            console.log(info)
            resolve({});
        }
    })
}