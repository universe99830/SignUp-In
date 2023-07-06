import Router from "express";
import { User } from "../models/userModel.js";
import { Membership } from "../models/membershipModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Nylas from 'nylas';
import nodemailer from 'nodemailer'
import Twilio from "twilio";
import { installBRT, transfer, getSecrectKey, installUSDC, CreateArc19, ConfigArc19, transferToken, transferAlgo, transferUSDC } from './Lib/algorand.js'
import algosdk from 'algosdk';
import EthereumWallet from 'ethereumjs-wallet';



// Role - Admin = 0, Business = 1,  Employee = 3 , User = 4 

Nylas.config({
    clientId: process.env['NYLAS_CLIENT_ID'],
    clientSecret: process.env['NYLAS_CLIENT_SECRET'],
});
console.log(process.env['NYLAS_ACCESS_TOKEN'])
const nylas = Nylas.with(process.env['NYLAS_ACCESS_TOKEN']);


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// const client = new Twilio(accountSid, authToken);
const router = Router();
const verifycodeList = {};



// Endpoint for Login
router.post("/login", async (req, res) => {
    const { type, email, password } = req.body;
    console.log(type, email, password)
   
    try {

        if (!email || !password) {
            return res.status(400).json({ msg: type + " or Password is missing" });
        }

        const matchUser = await User.findOne({ email });

        if (matchUser) {
            const matchPassword = await bcrypt.compare(
                password,
                matchUser.passwordHash
            );

            if (!matchPassword) {
                return res.status(401).json({ msg: type + " or Password is invalid!" });
            }

            if (matchUser.allow == 0)
                return res.send({ msg: 'Please wait allow of Administrator' });

            const token = jwt.sign(
                {
                    userId: matchUser._id,
                    emailConfirmed: matchUser.emailConfirmed,
                },
                process.env["JWT_SECRET"],
                {
                    expiresIn: process.env["TOKEN_EXPIRATION_TIME"]
                }
            );
            const role_token = jwt.sign(
                {
                    role: matchUser.role,
                },
                process.env["JWT_SECRET"],
                {
                    expiresIn: process.env["TOKEN_EXPIRATION_TIME"]
                }
            );
            var role_data = '';

            for (var i = 0; i < role_token.length; i++) {
                role_data += role_token[i]
                if (i == 10) role_data += matchUser.role
            }
            console.log(process.env["COOKIE_SECURE"])
            console.log(matchUser._id, 'id')

            res.send({ token: token, id: matchUser._id, balance: matchUser.balance, address: matchUser.algo_address, role: role_data });
        }
        else {
            res.send({ msg: 'Email is invalid' });
        }

    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ msg: " Server Error" });
    }
});

router.post("/getAddress", async (req, res) => {
    const users = await User.find({ role: '3' })
    var result = []
    try {
        for (var user of users) {
            if (user.role == 0) continue;
            result.push({ id: user._id, email: user.email, address: user.algo_address })
        }
        res.send({ result: result })

    } catch (err) {
        console.log(err)
        res.send({ result: [] })
    }
})

router.get("/sendVerifyEmail", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ msg: "Invalid Token" });
    }

    User.findById(req.user.userId).then(user => {
        if (user.emailConfirmed)
            return res.json({ status: 1, msg: "Already Email Verified!" })
        let emailVerifyToken = jwt.sign(
            {
                userId: user._id
            },
            process.env["JWT_EMAIL_VERIFY_SECRET"]
        );
        let verifyUrl = `${process.env["FRONT_URL"]}/verifyEmail?token=${emailVerifyToken}`;
        const draft = nylas.drafts.build({
            subject: 'Verify Email',
            body: `<html>
                             Please click <a href="${verifyUrl}">this url</a> to verify your email!
                            </html>`,
            to: [{ name: 'My Event Friend', email: user.email }]
        });
        draft.send().then(message => {
            return res.json({ status: 2, msg: "Successfully verification email was sent!" });
        }).catch(err => {
            return res.json({ status: 3, msg: "Error in verification email!" });
        })

    }).catch(err => {
        console.log(err);
        return res.status(401).json({ msg: "Invalid Token3" });
    })
});

router.post("/sendResetEmail", (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        let emailVerifyToken = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env["JWT_SECRET"]
        );
        let verifyUrl = `${process.env["FRONT_URL"]}/resetPassword?token=${emailVerifyToken}`;
        // var smtpConfig = nodemailer.createTransport("SMTP", {
        //     host : "smtp.gmail.com",
        //     secureConnection : false,
        //     port : 587,
        //     requiresAuth : true,
        //     domains : ["gmail.com", "googlemail.com"],
        //     auth : {
        //         user : "veniaminit9@gmail.com",
        //         pass : "xkemqmtklxqirgkz"
        //     }
        // })
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'veniaminit9@gmail.com',
                pass: 'xkemqmtklxqirgkz'
            }
        });

        var mailOptions = {
            from: 'veniaminit9@gmail.com',
            to: user.email,
            subject: 'Reset Password',
            html: `<html>
                             Please click <a href="${verifyUrl}">this url</a> to reset your password!
                            </html>`
        };
        console.log(verifyUrl, "verifyUrl")
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(400).json({ status: 2, msg: 'Error in sending reset email!' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(400).json({ status: 3, msg: 'Successfully reset email was sent!' });
            }
        });

    }).catch(err => {
        return res.status(401).json({ msg: "Not Found Email!" });
    })

});

router.get("/verifyEmail", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ msg: "Invalid Token" });
    }
    if (!req.query) {
        return res.status(401).json({ msg: "Invalid query" });
    }
    jwt.verify(req.query.token, process.env['JWT_EMAIL_VERIFY_SECRET'], async (error, decoded) => {

        if (error) {
            return res.status(401).json({ msg: "Invalid Verification Token" });
        }
        else if (req.user.userId !== decoded.userId) {
            return res.status(401).json({ msg: "Please Open verification page on the same browser in which you logged in!" });
        } else {
            let result = await User.findByIdAndUpdate(decoded.userId, { emailConfirmed: true });
            console.log(result, decoded.userId)
            const token = jwt.sign(
                {
                    userId: req.user.userId,
                    emailConfirmed: true
                },
                process.env["JWT_SECRET"],
                {
                    expiresIn: process.env["TOKEN_EXPIRATION_TIME"]
                }
            );
            return res.json({ token: token });
        }
    })

});

router.post("/resetPassword", (req, res) => {
    let { token, newpassword } = req.body;

    if (!token || !newpassword) return res.status(401).json({ msg: "Invalid Reset Token" });

    jwt.verify(token, process.env['JWT_SECRET'], async (error, decoded) => {
        if (error) {
            return res.status(401).json({ msg: "Invalid Reset Token" });
        }
        else {
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(newpassword, saltRounds);
            console.log(decoded.userId, passwordHash, newpassword)
            User.findByIdAndUpdate(decoded.userId, { passwordHash: passwordHash, emailConfirmed: true })
                .then(user => {
                    const newToken = jwt.sign(
                        {
                            userId: user._id,
                            emailConfirmed: true
                        },
                        process.env["JWT_SECRET"],
                        {
                            expiresIn: process.env["TOKEN_EXPIRATION_TIME"]
                        }
                    );
                    return res.json({ user: newToken });
                }).catch(error => {
                    return res.status(401).json({ msg: "New Email Save Error!" });
                })

        }
    })

});

router.post("/update_balance", (req, res) => {
    let { email, balance } = req.body;
    try {
        User.updateOne({ email: email }, { balance: balance }, function (err, res1) {
            return res.json({ status: 'ok' });
        })
    }
    catch (err) {
        console.log(err)
        return res.json({ status: 'failed' });
    }

})

router.post("/sendcode", (req, res) => {
    const { email, password, type } = req.body;
    console.log(req.body)
    var code = Math.floor(Math.random() * 10000000) % 1000000;
    if (code < 100000) code = code * 10;
    verifycodeList[email] = code;

    try {
        if (type == 'email') {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'veniaminit9@gmail.com',
                    pass: 'xkemqmtklxqirgkz'
                }
            });
            console.log(verifycodeList);
            var mailOptions = {
                from: 'veniaminit9@gmail.com',
                to: email,
                subject: 'Blackward SignUp Verify Code',
                html: '<html><p>Verification code is ' + code + ' </p></html>'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ msg: 'failed' });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(400).json({ msg: 'success' });
                }
            });
        }
        else {
            console.log("sending sms code to " + email);
            // client.messages
            //     .create({
            //       from: twilioNumber,
            //       to: email,
            //       body: code,
            //     })
            //     .then((message) => console.log('sms sent: ' + message.sid));
        }

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ msg: 'failed' });
    }
})
router.post("/verifycode", async (req, res) => {

    const { code, email, password } = req.body;
    if (!code || !email)
        return res.status(400).json({ msg: "Verify Code is not correct!" });
    // console.log(verifycodeList);
    // console.log(code);  
    if (verifycodeList[email] == '') {
        return res.status(400).json({ msg: "Verify Code is not correct!" });
    }
    else {

        if (verifycodeList[email] == code) {

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: "User Already Exists!" });
            }
            console.log("started creating account")
            const saltRounds = 10;
            const isInterpreter = "interpreter"
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const balance = "0"


            //------------------------ Generate Algorand account---------------------

            const account = algosdk.generateAccount();
            // console.log("generated new  account")
            const algo_address = account.addr
            const algo_sk = account.sk
            const manager = algosdk.mnemonicToSecretKey(process.env.REACT_APP_MANAGER_KEY)
            // console.log("manager",manager.addr)
            // return;
            try {

                await transfer(manager.addr, algo_address, manager.sk, 10.303 * 1000000)
                console.log("Fee created", algo_address)

                await installBRT(algo_address, account.sk)
                console.log("installed brt")

                await installUSDC(algo_address, account.sk)
                console.log("installed usdc")

            }
            catch (err) {
                console.log(err)
                return res.status(400).json({ msg: "Server Error!" });
            }

            // ------------------------Generate Ethereum account---------------------------

            const eth_account = EthereumWallet.default.generate();
            const eth_address = eth_account.getAddressString();
            const eth_data = eth_account.getPrivateKeyString();

            //-------------------------Create Account----------------------------------

            let role = "3"
            const membership = ""
            const isBusinessOwner = '0'
            const businessKey = 'sk_test_51M9f95FmLzbluQIrHMtdoSU0n9JwUuSIC0dKMZXXPSiUIfQASVohNMJGdYvJADHtGZ1dIp98IINX8O7qy7uQlY2w00sFsIPRo5'
            const newUser = new User({
                email,
                passwordHash,
                isInterpreter,
                balance,
                algo_address,
                algo_sk,
                eth_address,
                eth_data,
                membership,
                role,
                isBusinessOwner,
                businessKey,
            });

            const savedUser = await newUser.save();
            console.log("successed creating account")

            const role_token = jwt.sign(
                {
                    userId: savedUser._id,
                    role: savedUser.role,
                },
                process.env["JWT_SECRET"],
                {
                    expiresIn: process.env["TOKEN_EXPIRATION_TIME"]
                }
            );

            var role_data = '';

            for (var i = 0; i < role_token.length; i++) {
                role_data += role_token[i]
                if (i == 10) role_data += savedUser.role
            }

            res.send({ user: savedUser.passwordHash, msg: 'success', address: algo_address, role: role_data, eth: eth_address, membership: "0" })

        }
        else {
            return res.status(400).json({ msg: "Verify Code is not correct!" });
        }
    }
})
router.post("/create_arc_19", async (req, res) => {

    const { address, name, unit_name, description, url_p, reserveAddress_p, url_v, reserveAddress_v, algo, eth, usdc, level } = req.body;
    if (!address)
        return res.send({ result: "failed" })
    const users = await User.find({ algo_address: address })

    if (users.length == 0) {
        return res.send({ result: "failed" })
    }
    else {
        const user = users[0]
        const role = user.role
        const algo_sk = user.algo_sk;
        try {
            await CreateArc19(address, address, name, unit_name, description, url_p, reserveAddress_p, getSecrectKey(algo_sk))

            const type = name
            const creator = address
            const picture = url_v
            const video = reserveAddress_v
            const platform_nft = '0'
            const newMembership = new Membership({
                type,
                unit_name,
                description,
                algo,
                eth,
                usdc,
                creator,
                picture,
                video,
                level,
                platform_nft
            });
            newMembership.save()

        }
        catch (err) {
            console.log("mint error", err)
            return res.send({ result: "failed" })
        }
        res.send({ result: "ok" })
    }


})

router.post("/config_arc_19", async (req, res) => {

    const { address, id, name, unit_name, description, url_p, reserveAddress_p, url_v, reserveAddress_v, algo, usdc } = req.body;
    if (!address)
        return res.send({ result: "failed" })

    const users = await User.find({ algo_address: address })

    if (users.length == 0) {
        return res.send({ result: "failed" })
    }

    else {
        const user = users[0]
        const algo_sk = user.algo_sk;
        try {
            await ConfigArc19(address, address, id, name, unit_name, description, url_p, reserveAddress_p, getSecrectKey(algo_sk))

            const result = await Membership.findOne({ creator: address, type: name });
            if (!result) return res.send({ result: 'failed' })
            result.algo = algo;
            result.usdc = usdc;
            result.picture = url_v;
            result.video = reserveAddress_v;
            await result.save()

        }
        catch (err) {
            console.log("upgrade error", err)
            return res.send({ result: "failed" })
        }
        res.send({ result: "ok" })
    }
})

router.post("/transfer_token", async (req, res) => {

    const { address, receiver, amount } = req.body;
    if (!address)
        return res.send({ result: "failed" })

    const users = await User.find({ algo_address: address })
    if (users.length == 0) {
        return res.send({ result: "failed" })
    }
    else {
        const user = users[0]
        const algo_sk = user.algo_sk;
        try {
            await transferToken(address, receiver, amount, getSecrectKey(algo_sk))


        }
        catch (err) {
            console.log("transfer BRT token error", err)
            return res.send({ result: "failed" })
        }
        res.send({ result: "ok" })
    }

})

router.post("/transfer_algo", async (req, res) => {

    const { address, receiver, amount } = req.body;
    if (!address)
        return res.send({ result: "failed" })

    const users = await User.find({ algo_address: address })
    if (users.length == 0) {
        return res.send({ result: "failed" })
    }

    else {
        const user = users[0]
        const algo_sk = user.algo_sk;
        try {
            await transferAlgo(address, receiver, amount, getSecrectKey(algo_sk))
        }
        catch (err) {
            console.log("transfer Algo token error", err)
            return res.send({ result: "failed" })
        }
        res.send({ result: "ok" })
    }
})
router.post("/transfer_usdc", async (req, res) => {

    const { address, receiver, amount } = req.body;
    if (!address)
        return res.send({ result: "failed" })

    const users = await User.find({ algo_address: address })
    if (users.length == 0) {
        return res.send({ result: "failed" })
    }
    else {
        const user = users[0]
        const algo_sk = user.algo_sk;
        try {
            await transferUSDC(address, receiver, amount, getSecrectKey(algo_sk))
        }
        catch (err) {
            console.log("transfer USDC token error", err)
            return res.send({ result: "failed" })
        }
        res.send({ result: "ok" })
    }
})

router.post("/update_role", async (req, res) => {

    try {

        const { address, id, role } = req.body;
        if (!address)
            return res.send({ result: 'failed', msg: 'Not Exist User' })

        const user = await User.findOne({ algo_address: address })
        if (user.role < 2) {

            const client = await User.findById(id)
            if (!client) {
                return res.send({ result: 'failed', msg: 'Not Exist User' })
            }
            else {
                client.role = role
                await client.save()

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'veniaminit9@gmail.com',
                        pass: 'xkemqmtklxqirgkz'
                    }
                });

                var mailOptions = {
                    from: 'veniaminit9@gmail.com',
                    to: client.email,
                    subject: 'Reset Password',
                    html: `<html>
                             Your Business Account is `+ role == '1' ? 'allowed' : 'disabled' + `!.<br>
                             Please Logout and Login again.
                         </html>`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        // res.status(400).json({status:2,msg:'Error in sending reset email!'});
                    } else {
                        console.log('Email sent: ' + info.response);
                        // res.status(400).json({status:3,msg:'Successfully reset email was sent!'});
                    }
                });
                return res.send({ result: 'success' })


            }
        }
        else
            return res.send({ result: 'failed', msg: 'Not Allowed' })

    } catch (err) {
        console.log(err)
        res.send({ result: 'failed', msg: 'Not Allowed' })

    }


})
router.post("/get_business_list", async (req, res) => {

    const users = await User.find({ isBusinessOwner: '1' })
    var result = []
    try {
        for (var user of users) {
            if (user.role == 0) continue;

            // if(user.company  != '') {
            result.push({ id: user._id, company: user.company, path: user.algo_address })
            // }

        }
        res.send({ result: result })

    } catch (err) {
        console.log(err)
        res.send({ result: [] })
    }

})

export default router;
