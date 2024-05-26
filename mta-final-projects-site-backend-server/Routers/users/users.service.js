const UserDB = require("../../DB/entities/user.entity")
const jwt = require('jsonwebtoken');

const pathSqurity = {
  "/add-id": "admin",
  "/add-points": "judge"
}

const secretKey='SuperKey123'

const FAILED_RESOULT = {
  success: false,
}

class UsersSerivce {
  checkLoginDetails = async (userID, password) => {
    try {
      const user = await UserDB.findOne({ ID: userID, password: password }).lean();
      if (!user) {
        return {
          success: false,
          error: "User not found"
        }
      }
      const token = jwt.sign({ data: {
        id: user.ID,
        name: user.name,
        email: user.email,
        type: user.type,
      } }, secretKey, { expiresIn: '100y' });
      return {
        success: true,
        token,
        user: {
          type: user.type,
          name: user.name
        }
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: "Unknown error server - login"
      }
    }
  }

  async checkToken(token) {
    if (!token) {
      console.error("No Token")
      return;
    }
    const user = jwt.verify(token, secretKey)
    if (!user) {
      console.error("No valid token")
      return;
    }
    return user.data
  }

  auth(token) {
    const decoded = jwt.verify(token, secretKey);
    return decoded.user
  }

  validateType(path, user) {
    const requiredPerrmisionType = pathSqurity[path];
    const userType = user.type;
    if (!requiredPerrmisionType) {
      return false
    } else {
      if (requiredPerrmisionType === userType) {
        return true
      } else {
        return false
      }
    }
  }

  addId(path,token, ID) {
    const user = this.auth(token);
    const isValid = this.validateType(path, user)
    if (!isValid) {
      return {
        success: false,
        error: "unauthorised"
      }
    }
  }
  
  addUser(path, token, userName, password) {

    const requestSender = this.auth(token);
    if (requestSender.type !== "admin") {
      return {
        success: false,
        error: "unathorized"
      }
    }
  }

  checkIfUserExist = async (userID) => {
   
  }
  
  async registerNewUserWithFullDetails(userID, fullName, email, type, password) {
    try {
      // Creating a new user instance
      const newUser = new UserDB({
          ID: userID,  
          name: fullName,
          email: email,
          password: password, 
          type: type,
      });
  
      // Saving the new user to the database
      await newUser.save();
      console.log('User added successfully!');
      return {success: true}
  } catch (error) {
      console.error('Error adding user:', error);
      return {success: false}
  }
  }
  

  
}
/**
 * this class will run all the users functions
 */
const usersSerivce = new UsersSerivce()

module.exports = {usersSerivce}