const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    mainUserDegree: req.body.mainUserDegree,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    backupName: req.body.backupName,
    backupLastname: req.body.backupLastname,
    backUserDegree: req.body.backUserDegree,
    backupPhoneNumber: req.body.backupPhoneNumber,
    companyName: req.body.companyName,
    companyAddress: req.body.companyAddress,
    numberOfScreens: req.body.numberOfScreens,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  console.log(req.body);

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  }
  );
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const targetRoleId = '64eda2e32440d4728765b786';
    console.log(users.filter(user => user.roles.some(roleId => roleId.toString() === targetRoleId)));
    const returnUsers = users.filter(user => user.roles.some(roleId => roleId.toString() === targetRoleId));
    res.status(200).json(returnUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    localStorage.removeItem('accessToken');
    res.status(200).json({ message: 'User signed out' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing out user', error: error.message });
  }
};