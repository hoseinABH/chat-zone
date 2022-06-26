// Modles
import User from '../models/User.js';

export async function getAllUsers(req, res) {
  try {
    let users = await User.find();
    users.map((user) => {
      const { password, ...otherData } = user._doc;
      return otherData;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
}
