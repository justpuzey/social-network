const { Thought, User, Types } = require('../models');


const ThoughtController = {

  // Get All Thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Get Thought by ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },


  // Add Thought to User
  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // Remove Thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedthought => {
        if (!deletedthought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: params.username },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // Add Reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // Remove Reaction
  // removeReaction({ params }, res) {
  //   Thought.findOneAndUpdate(
  //     { _id: params.thoughtId },
  //     { $pull: { reactions: { reactionId: params.reactionId } } },
  //     { new: true }
  //   )
  //     .then(dbUserData => res.json(dbUserData))
  //     .catch(err => res.json(err));
  // }

  removeReaction({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedreaction => {
        if (!deletedreaction) {
          return res.status(404).json({ message: 'No reaction with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactionId: params.reactionId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  }
};

module.exports = ThoughtController