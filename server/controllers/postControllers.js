import mongoose from 'mongoose';
// Helpers
import { handleResponse } from '../helper/response.js';
// Models
import Post from '../models/Post.js';
import User from '../models/User.js';

export async function createPost(req, res) {
  const newPost = new Post(req.body);
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(handleResponse(error.message));
  }
}

export async function getPost(req, res) {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(handleResponse(error.message));
  }
}

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json(handleResponse('Post updated!', true));
    } else {
      res.status(403).json(handleResponse('Authentication failed'));
    }
  } catch (error) {
    res.status(500).json(handleResponse(error.message));
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json(handleResponse('Post deleted.'));
    } else {
      res.status(403).json(handleResponse('Action forbidden'));
    }
  } catch (error) {
    res.status(500).json(handleResponse(error.message));
  }
};

export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await Post.findById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json(handleResponse('Post disliked', true));
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json(handleResponse('Post liked', true));
    }
  } catch (error) {
    res.status(500).json(handleResponse(error.message));
  }
};

// Get timeline posts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await Post.find({ userId: userId });

    const followingPosts = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'following',
          foreignField: 'userId',
          as: 'followingPosts',
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(handleResponse(error.message));
  }
};
