const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Defining the User schema
const userSchema = new Schema(
  {
    // User's unique username
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // User's email address, validated using REGEX
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    // User's hashed password
    password: {
      type: String,
      required: true,
    },
    // URL for the user's profile photo ('secure_url' from Cloudinary)
    profilePhoto: {
      type: String,  
    },
    // List of cocktails created by or saved by the user (user is able to search for cocktails using TheCocktailDB API,
    // and can save the cocktail to their profile.  When they save it, it is added to this cocktails array)
    cocktails: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Cocktail'
      }
    ],
    // List of posts created by the user
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],
    // List of posts the user has liked
    likedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      },
    ],
     // List of comments made by the user
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        post: {
          type: Schema.Types.ObjectId,
          ref: 'Post',
        },
      },
    ],
  },
  // Options to include virtuals when converting to JSON
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Create the User model
const User = model('User', userSchema);

// Export the User model
module.exports = User;