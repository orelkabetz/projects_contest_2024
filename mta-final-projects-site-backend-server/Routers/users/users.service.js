const potentialUserDB = require("../../DB/entities/potential_users.entity");
const UserDB = require("../../DB/entities/user.entity");
const jwt = require('jsonwebtoken');
const availablePreferencesDB = require("../../DB/entities/available_preferences.entity");

const pathSecurity = {
  "/add-id": "admin",
  "/add-points": "judge"
};

const secretKey = 'SuperKey123';

const FAILED_RESULT = {
  success: false,
};

class UsersService {
  checkLoginDetails = async (userID, password) => {
    try {
      const user = await UserDB.findOne({ ID: userID, password: password }).lean();
      if (!user) {
        return {
          success: false,
          error: "User not found"
        };
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
          name: user.name,
          email: user.email
        }
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: "Unknown server error - login"
      };
    }
  }

  async checkToken(token) {
    if (!token) {
      console.error("No Token");
      return;
    }
    const user = jwt.verify(token, secretKey);
    if (!user) {
      console.error("Invalid token");
      return;
    }
    return user.data;
  }

  auth(token) {
    const decoded = jwt.verify(token, secretKey);
    return decoded.user;
  }

  validateType(path, user) {
    const requiredPermissionType = pathSecurity[path];
    const userType = user.type;
    if (!requiredPermissionType) {
      return false;
    } else {
      return requiredPermissionType === userType;
    }
  }

  addId(path, token, ID) {
    const user = this.auth(token);
    const isValid = this.validateType(path, user);
    if (!isValid) {
      return {
        success: false,
        error: "unauthorized"
      };
    }
  }

  async checkIfUserExistsInPotentialUsers(userID) {
    try {
      const user = await potentialUserDB.findOne({ ID: userID }).lean();
      return !!user;
    } catch (error) {
      console.error('Error checking user existence in potential users:', error);
      throw error;
    }
  }
  
  async registerNewUserWithFullDetails(userID, fullName, email, type, password) {
    try {
      const userExistsInPotentialUsers = await this.checkIfUserExistsInPotentialUsers(userID);
      if (!userExistsInPotentialUsers) {
        console.log('User ID does not exist in potential users. Registration not allowed.');
        return { success: false, error: 'User ID not found in potential users' };
      }

      const userExists = await this.checkIfUserExists(userID);
      if (userExists) {
        console.log('User ID already exists. Registration not allowed.');
        return { success: false, error: 'User ID already exists' };
      }

      const newUser = new UserDB({
        ID: userID,
        name: fullName,
        email: email,
        password: password,
        type: type,
      });

      await newUser.save();
      console.log('User added successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error adding user:', error);
      return { success: false };
    }
  }

  async checkIfUserExists(userID) {
    try {
      const user = await UserDB.findOne({ ID: userID }).lean();
      return !!user;
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

  async addPreference(userID, preferenceId) {
    try {
      const user = await UserDB.findOne({ ID: userID });
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      if (!user.selected_preferences.includes(preferenceId)) {
        user.selected_preferences.push(preferenceId);
        await user.save();
      }
      return { success: true };
    } catch (error) {
      console.error('Error adding preference:', error);
      return { success: false, error: 'Failed to add preference' };
    }
  }

  async removePreference(userID, preferenceId) {
    try {
      const user = await UserDB.findOne({ ID: userID });
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      user.selected_preferences = user.selected_preferences.filter(id => id !== preferenceId);
      await user.save();
      return { success: true };
    } catch (error) {
      console.error('Error removing preference:', error);
      return { success: false, error: 'Failed to remove preference' };
    }
  }

  async updateUserField(userID, field, newValue) {
    try {
      const user = await UserDB.findOne({ ID: userID });
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (field === 'password') {
        user.password = newValue; 
        await user.save();
      } else if (field === 'name') {
        user.name = newValue;
        await user.save();
      } else if (field === 'email'){
        console.log("reached email"); 
        user.email = newValue;
        await user.save();
      } else {
        return { success: false, error: 'Invalid field' };
      }

      await user.save();
      return { success: true };
    } catch (error) {
      console.error('Error updating user field:', error);
      return { success: false, error: 'Failed to update user field' };
    }
  }
}

const usersSerivce = new UsersService();

module.exports = { usersSerivce };
