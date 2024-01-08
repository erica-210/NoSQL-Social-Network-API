const { User } = require("../models");

module.exports = {
  // get users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get sinlge user by id
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("thoughts")
        .populate("friends");

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update user by id
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user by its id
  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // adding friends to a user's friend list
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        {$push: {friends: req.params.friendId}},
        { new: true }
      );

      res.json({ message: "Friend added successfully", user });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // removing friends from a user's friend list
  async removeFriend(req, res) {
    try {
      const deletedFriend = await User.findByIdAndUpdate(
        req.params.userId,
        {$pull: {friends: req.params.friendId}},
        { new: true }
        );

      if (!deletedFriend) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json({ message: "Friend removed successfully", deletedFriend });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
