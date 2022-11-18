const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { config } = require("../config/secret.js");
const { createToken, mailOptions } = require("../helpers/userHelper");
const { UserModel } = require("../models/userModel");
const { validUser, validLogin } = require("../validation/userValidation");
const { UserVerificationModel } = require("../models/userVerificationModel");
// const { validVerifyUser} = require("../validation/userVerifyValidation");
// export const API_URL = 'http://localhost:27017'
// const currentUrl = "https://user-api-ptu9.onrender.com";
const salRounds = 10;



let transporter = nodemailer.createTransport({

  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: config.authEmail,
    pass: config.authPass
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
    console.log(config.authEmail);
    console.log(config.authPass);
  } else {
    console.log("ready for messages");
    console.log("success");
  }

})

const sendVerificationEmail = async ({ _id, email }, res) => {
  console.log("email " + email)
  console.log("id " + _id)
  const uniqueString = uuidv4() + _id;
  let mail=mailOptions(_id,uniqueString,email);

  await bcrypt
    .hash(uniqueString, salRounds)
    .then((hasheduniqueString) => {

      const UserVerification = new UserVerificationModel({
        userId: _id,
        uniqueString: hasheduniqueString,
      });
      UserVerification
        .save()
        .then(() => {
          transporter.sendMail(mail, (err, info) => {
            if (err) {
              console.log(err);
            }
            console.log('Message sent: %s', info.response);

          })

        })
        .catch((error) => {
          console.log(error)
          res.json({
            status: "failed",
            message: "an error  cant save",
          });
        })

    })
    .catch(() => {
      res.json({
        status: "failed",
        message: "an error occurre",
      });
    })
};

exports.authCtrl = {
  signUp: async (req, res) => {
    let validBody = validUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, salRounds);
      await user.save();
      user.password = "***";
      sendVerificationEmail(user, res);
      res.status(201).json(user);
    }
    catch (err) {
      if (err.code == 11000) {
        return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })
      }
      console.log(err);
      res.status(500).json({ msg: "err", err })
    }
  }
  ,
  login: async (req, res) => {
    let validBody = validLogin(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let user = await UserModel.findOne({ email: req.body.email })
      if (!user) {
        return res.status(401).json({ status: "failed", msg: "Password or email is worng ,code:1" })
      } else if (!user.verified) {
        return res.status(401).json({ status: "failed", msg: "Email hasnt been verified yet. check your inbox. " });
      }
      let authPassword = await bcrypt.compare(req.body.password, user.password);
      if (!authPassword) {
        return res.status(401).json({ status: "failed", msg: "Password or email is worng ,code:2" });
      }
      let token = createToken(user._id, user.role);
      let data = {
        token: token,
        userRole: user.role,
        id: user._id,
      }
      res.json(data);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },
  verifyUser: async (req, res) => {
    let { userId, uniqueString } = req.params;
    UserVerificationModel
      .find({ userId })
      .then((result) => {
        if (result.length > 0) {

          const { expiresAt } = result[0];

          const hashedUniqueString = result[0].uniqueString;
          if (expiresAt < Date.now()) {
            UserVerificationModel
              .deleteone({ userId })
              .then(result => {
                UserModel
                  .deleteone({ _id: userId })
                  .then(() => {
                    let message = "link hsa expired.please sigh up again ";
                    res.redirect(`/users/verified/?error=true&message=${message}`);
                  })
                  .catch((error) => {
                    let message = "clearing user with expired unique string failed ";
                    res.redirect(`/users/verified/?error=true&message=${message}`);
                  })
              })
              .catch((error) => {
                console.log(error);
                let message = "an error occurre while clearing  expired user verification record";
                res.redirect(`/users/verified/?error=true&message=${message}`);
              })
          }
          else {
            bcrypt
              .compare(uniqueString, hashedUniqueString)
              .then(result => {
                if (result) {
                  UserModel
                    .updateOne({ _id: userId }, { verified: true })
                    .then(() => {
                      UserVerificationModel
                        .deleteOne({ userId })
                        .then(() => {
                          res.sendFile(path.join(__dirname, "./../views/verified.html"));
                        })
                        .catch(error => {
                          console.log(error)
                          let message = "an error occurre while finalizing sucssful verification  ";
                          res.redirect(`/users/verified/?error=true&message=${message}`);
                        })
                    }
                    )
                    .catch(error => {
                      console.log(error)
                      let message = "an error occurre while updating user verified ";
                      res.redirect(`/users/verified/?error=true&message=${message}`);
                    })

                } else {
                  let message = "invalid verification details passed.check your inbox.";
                  res.redirect(`/users/verified/?error=true&message=${message}`);
                }
              })
              .catch((error) => {
                console.log(error)
                let message = "an error occurre while compering unique strings ";
                res.redirect(`/users/verified/?error=true&message=${message}`);
              })
          }

        } else {
          let message = "Account   doesnt exist or has been verified already.please sign up or login in.";
          res.redirect(`/users/verified/?error=true&message=${message}`);
        }
      })
      .catch((error) => {
        console.log(error)
        let message = "an error occurre while checking for existing user Verification record ";
        res.redirect(`/users/verified/?error=true&message=${message}`);
      })
  },
  verifiedUser: async (req, res) => {
    res.sendFile(path.join(__dirname, "../views/verified.html"))
  }
}
