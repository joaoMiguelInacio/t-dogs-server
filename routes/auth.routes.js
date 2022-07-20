const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const isAuthenticated = require("../middleware/isAuthenticated");
const Buyer = require("../models/Buyer.model");
const saltRounds = 10;

/**
 *
 * * All the routes are prefixed with `/api/auth`
 *
 */

router.post("/signup", async (req, res, next) => {
  const {userType} = req.body;
  if (userType === "buyer") {
    const {
      name,
      email,
      password,
      address,
      hasChildren,
      hasExperience,
      hasPets,
    } = req.body;
    console.log("req.body", req.body);
    if (email === "" || name === "" || password === "" || address === "") {
      res
        .status(400)
        .json({
          message: "Please provide your email, name, password and address",
        });
    }

    // ! To use only if you want to enforce strong password (not during dev-time)

    // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    // if (!regex.test(password)) {
    // 	return res
    // 		.status(400)
    // 		.json({
    // 			message:
    // 				"Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    // 		});
    // }

    try {
      const foundBuyer = await User.findOne({ email });
      console.log("foundBuyer", foundBuyer);
      if (foundBuyer) {
        res
          .status(400)
          .json({ message: "Email already registered, please login." });
        return;
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPass = bcrypt.hashSync(password, salt);

      const createdBuyer = await Buyer.create({
        name,
        email,
        password: hashedPass,
        address,
        hasChildren,
        hasExperience,
        hasPets,
      });

      const user = createdBuyer.toObject();
      delete user.password;
      // ! Sending the user as json to the client
      res.status(201).json({ user });
    } catch (error) {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage:
            "Only one can be associated to an email. The email you chose is already in use.",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    }
  } else {
		const {
		  name,
		  email,
		  password,
		  address,
		} = req.body;
		console.log("req.body", req.body);
		if (email === "" || name === "" || password === "" || address === "") {
		  res
			.status(400)
			.json({
			  message: "Please provide your email, name, password and address",
			});
		}
	
		// ! To use only if you want to enforce strong password (not during dev-time)
	
		// const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
	
		// if (!regex.test(password)) {
		// 	return res
		// 		.status(400)
		// 		.json({
		// 			message:
		// 				"Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
		// 		});
		// }
	
		try {
		  const foundSeller = await User.findOne({ email });
		  console.log("foundSeller", foundSeller);
		  if (foundSeller) {
			res
			  .status(400)
			  .json({ message: "Email already registered, please login." });
			return;
		  }
		  const salt = bcrypt.genSaltSync(saltRounds);
		  const hashedPass = bcrypt.hashSync(password, salt);
	
		  const createdSeller = await Seller.create({
			name,
			email,
			password: hashedPass,
			address,
		  });
	
		  const user = createdSeller.toObject();
		  delete user.password;
		  // ! Sending the user as json to the client
		  res.status(201).json({ user });
		} catch (error) {
		  console.log(error);
		  if (error instanceof mongoose.Error.ValidationError) {
			return res.status(400).json({ message: error.message });
		  }
		  if (error.code === 11000) {
			return res.status(400).json({
			  errorMessage:
				"Only one can be associated to an email. The email you chose is already in use.",
			});
		  }
		  return res.status(500).json({ errorMessage: error.message });
		}
  }
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).json({ message: "Please provide your email and password" });
  }
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(500).json({ message: "Wrong credentials." });
      return;
    }
    const goodPass = bcrypt.compareSync(password, foundUser.password);
    if (goodPass) {
      const user = foundUser.toObject();
      delete user.password;

      /**
       * Sign method allow you to create the token.
       *
       * ---
       *
       * - First argument: user, should be an object. It is our payload !
       * - Second argument: A-really-long-random-string...
       * - Third argument: Options...
       */

      const authToken = jwt.sign(user, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "2d",
      });

      //! Sending the authToken to the client !

      res.status(200).json({ authToken });
    } else {
      res.status(500).json({ message: "Wrong credentials." });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/me", isAuthenticated, (req, res, next) => {
  // console.log("req payload", req.payload);
  res.status(200).json(req.payload);
});

module.exports = router;
