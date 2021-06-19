const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


//Reaction Schema
const ReactionSchema = new Schema(
  {
    // reactionId
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    // reactionBody
    reactionBody: {
      type: String,
      required: 'Please Enter Your Reaction!',
      maxlength: 280
    },
    // username
    username: {
      type: String,
      required: 'Please Enter a name',
      trim: true
    },
    // createdAt
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
)


//Thought Schema
const ThoughtSchema = new Schema(
  {

    username: {
      type: String,
      required: true,
      trim: true
    },
    thoughtText: {
      type: String,
      required: 'Please add your thought',
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    reactions: [ReactionSchema]
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
    id: false
  }
)

ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema)

module.exports = Thought

//thoughtText
//createdAt
//uername
//reactions