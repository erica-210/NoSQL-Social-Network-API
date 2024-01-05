const { Thought, User } = require('../models');

module.exports = {
  // get thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get sinlge thought by id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'Thought created, but found no user with that ID' });
      }

      res.json('Created the thought 🎉');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // update thought by id
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a thought by its id
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findByIdAndRemove(req.params.thoughtId);

      if (!deletedThought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json({ message: "Thought deleted successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // adding reactions to a thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        {$push: {reactions: req.body}},
        { new: true }
        );


      res.json({ message: "reaction added successfully", thought });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // removing reactions from a thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      const reactionId = req.params.reactionId;

      // Filter out the reactionId from the reaction list
      thought.reactions = thought.reactions.filter(
        (reaction) => reaction.toString() !== reactionId
      );
      await thought.save(); 

      res.json({ message: "Reaction removed successfully", thought });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
