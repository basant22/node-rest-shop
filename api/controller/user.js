const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: "User alrady exist"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(200).json({
                                    message: "User signup successfully",
                                    userDetail: {
                                        email: result.email
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    message: "Invalid request"
                                });
                            });
                    }
                });
            }
        });
}
exports.user_login = (req, res, next) => {
    console.log("email-", req.body.email);
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        id: user[0]._id
                    }, "secret", {
                        expiresIn: "1h",
                    });
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                });

            })
        })
        .catch(err => {
            res.status(500).json({
                message: "User not found",
                error: err
            });
        });
}
exports.user_delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "User deleted successfully",
                error: err
            });
        })
}