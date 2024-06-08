const potentialUserDB = require("../../DB/entities/potential_users.entity");
const UserDB = require("../../DB/entities/user.entity")
const jwt = require('jsonwebtoken');
const availablePreferencesDB = require("../../DB/entities/available_preferences.entity");

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

  async checkIfUserExistInPotentialUsers(userID) {
    try {
      const user = await potentialUserDB.findOne({ ID: userID }).lean();
      return user ? true : false;
    } catch (error) {
      console.error('Error checking user existence in potential users:', error);
      throw error;
    }
  }
  
  async registerNewUserWithFullDetails(userID, fullName, email, type, password) {
    try {
      // Check if the user ID exists in the potential_users collection
      const userExistsInPotentialUsers = await this.checkIfUserExistInPotentialUsers(userID);
      if (!userExistsInPotentialUsers) {
        console.log('User ID does not exist in potential users. Registration not allowed.');
        return { success: false, error: 'User ID not found in potential users' };
      }

      // Check if the user ID already exists in the users collection
      const userExists = await this.checkIfUserExist(userID);
      if (userExists) {
        console.log('User ID already exists. Registration not allowed.');
        return { success: false, error: 'User ID already exists' };
      }

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
      return { success: true };
    } catch (error) {
      console.error('Error adding user:', error);
      return { success: false };
    }
  }
  async checkIfUserExist(userID) {
    try {
      const user = await UserDB.findOne({ ID: userID }).lean();
      return user ? true : false;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error;
    }
  }

  async getPreferences() {
    try {
      const preferences = await availablePreferencesDB.find({}, 'ID');
      return preferences;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  }

  async savePreferences(userID, selectedPreferences) {
    try {
      const user = await UserDB.findOne({ ID: userID });
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      user.selected_preferences = selectedPreferences;
      await user.save();
      return { success: true };
    } catch (error) {
      console.error('Error saving preferences:', error);
      return { success: false, error: 'Failed to save preferences' };
    }
  }
  async getUserPreferences(userID) {
    try {
      const user = await UserDB.findOne({ ID: userID });
      if (!user) {
        return [];
      }
      return user.selected_preferences;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }
  
}
/**
 * this class will run all the users functions
 */
const usersSerivce = new UsersSerivce()

module.exports = {usersSerivce}