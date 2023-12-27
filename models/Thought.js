const { Schema, model } = require("mongoose");
const { format } = require("date-fns");

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

// Define a getter method for formatted timestamp
thoughtSchema.virtual("formattedCreatedAt").get(function () {
  return format(this.createdAt, "yyyy-MM-dd HH:mm:ss");
});

// Create a virtual field 'reactionCount' to retrieve the length of the reactions array
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
