// Modles
import User from '../models/User.js';
// Helpers
import { handleResponse } from '../helper/response.js';
// Libraries
import bcrypt from 'bcrypt';

export async function getAllUsers(req, res) {
  try {
    let users = await User.find();
    users.map((user) => {
      const { password, ...otherData } = user._doc;
      return otherData;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(handleResponse(error.message));
  }
}

export async function getUser(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (user) {
      const { password, ...otherData } = user._doc;
      res.status(200).json(otherData);
    } else {
      res.status(404).json(handleResponse('user not found.'));
    }
  } catch (error) {
    res.status(500).json(handleResponse(error.message));
  }
}

export async function updateUser(req, res) {
  const id = req.params.id;
  const { _id, password } = req.body;

  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(handleResponse(error.message));
    }
  } else {
    res.status(403).json(handleResponse('Access Denied.'));
  }
}

export async function deleteUser(req, res) {
  const id = req.params.id;
  try {
    await UserModel.findByIdAndDelete(id);
    res.status(200).json(handleResponse('User Deleted Successfully.', true));
  } catch (error) {
    res.status(500).json(handleResponse(error.message));
  }
}

export async function followUser(req, res) {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id == id) {
    res.status(403).json('Action Forbidden.');
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json(handleResponse('User followed!', true));
      } else {
        res
          .status(403)
          .json(handleResponse('you are already following this id'));
      }
    } catch (error) {
      res.status(500).json(handleResponse(error.message));
    }
  }
}

export async function unfollowUser(req, res) {
  const id = req.params.id;
  const { _id } = req.body;

  if (_id === id) {
    res.status(403).json(handleResponse('Action Forbidden'));
  } else {
    try {
      const unFollowUser = await UserModel.findById(id);
      const unFollowingUser = await UserModel.findById(_id);

      if (unFollowUser.followers.includes(_id)) {
        await unFollowUser.updateOne({ $pull: { followers: _id } });
        await unFollowingUser.updateOne({ $pull: { following: id } });
        res.status(200).json(handleResponse('Unfollowed Successfully!', true));
      } else {
        res.status(403).json(handleResponse('You are not following this User'));
      }
    } catch (error) {
      res.status(500).json(handleResponse(error.message));
    }
  }
}
