const { AuthenticationError } = require("apollo-server-express");
const { ApolloError } = require("apollo-server-errors");
const { User, Cocktail, Post } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // me: User
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id })
          .populate({
            path: "cocktails",
            model: "Cocktail",
          })
          .populate({
            path: "posts",
            model: "Post",
            populate: {
              path: "author",
              model: "User",
            },
          })
          .populate({
            path: "likedPosts",
            model: "Post",
            populate: {
              path: "author",
              model: "User",
            },
          });
        // Get the likedPost IDs for the user
        const likedPostIds = user.likedPosts.map((post) => post._id);
        // Loop through the posts and add likes and comments count
        user.posts.forEach((post) => {
          // Calculate the number of likes for each post
          post.likes = post.likes.length;

          // Calculate the number of comments for each post
          // post.comments = post.comments.length;

          // Check if the current post is liked by the user
          if (likedPostIds.includes(post._id)) {
            post.likedByUser = true;
          } else {
            post.likedByUser = false;
          }
        });
        // Update the count of liked posts for the user
        user.likedPostsCount = likedPostIds.length;
        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    cocktails: async (parent, args) => {
      return await Cocktail.find({}).sort({ name: "asc" });
    },
    posts: async (parent, args) => {
      return await Post.find({}).populate({
        path: "author",
        model: "User",
        select: "username profilePhoto",
      });
    },
  },
  Mutation: {
    // addUser
    addUser: async (parent, { username, email, password, profilePhoto }) => {
      console.log(
        "back end response: ",
        username,
        email,
        password,
        profilePhoto
      );
      const user = await User.create({
        username,
        email,
        password,
        profilePhoto,
      });
      const token = signToken(user);
      return { token, user };
    },
    // login
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    // add a cocktail
    addCocktail: async (parent, args, context) => {
      const { name, ingredients, imageURL, glassware, instructions, tags } =
        args;
      const parsedIngredients = ingredients.map(
        ({ ...ingredient }) => ingredient
      );

      try {
        if (context.user) {
          const cocktail = await Cocktail.create({
            name,
            ingredients: parsedIngredients,
            imageURL,
            glassware,
            instructions,
            tags,
          });

          const user = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { cocktails: cocktail._id } }
          );

          return cocktail;
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.log(err);
        throw new AuthenticationError(err);
      }
    },
    deleteCocktail: async (parent, { cocktailId }, context) => {
      if (context.user) {
        const cocktail = await Cocktail.findOneAndDelete({
          _id: cocktailId,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { cocktails: cocktail._id } }
        );

        return cocktail;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    editCocktail: async (
      parent,
      {
        cocktailId,
        name,
        ingredients,
        imageURL,
        glassware,
        instructions,
        tags,
      },
      context
    ) => {
      try {
        if (context.user) {
          const updatedCocktail = await Cocktail.findOneAndUpdate(
            { _id: cocktailId },
            {
              name,
              ingredients,
              imageURL,
              glassware,
              instructions,
              tags,
            },
            { new: true }
          );

          if (!updatedCocktail) {
            throw new Error("Cocktail not found");
          }

          return updatedCocktail;
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    // add a new post
    addPost: async (parent, args, context) => {
      const { postTitle, postContent, postImageURL, postDate } = args;
      try {
        if (context.user) {
          const post = await Post.create({
            postTitle,
            postContent,
            postImageURL,
            postDate,
            author: context.user._id,
          });

          await User.findByIdAndUpdate(context.user._id, {
            $addToSet: { posts: post._id },
          });

          const populatedPost = await post.populate("author").execPopulate();

          return populatedPost;
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.log(err);
        throw new ApolloError("Failed to create a new post.");
      }
    },
    deletePost: async (parent, { postId }, context) => {
      if (context.user) {
        const post = await Post.findOneAndDelete({
          _id: postId,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { posts: post._id } }
        );

        return null;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    editProfilePhoto: async (parent, { profilePhoto }, context) => {
      try {
        if (context.user) {
          // Update the profile photo for the logged-in user
          const user = await User.findOneAndUpdate(
            { _id: context.user._id },
            { profilePhoto },
            { new: true }
          );

          return user;
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.error(err);
        throw new ApolloError("Failed to edit profile photo.");
      }
    },

    // Add a comment to a post
    // addComment: async (parent, { postId, text }, context) => {
    //   try {
    //     if (context.user) {
    //       // Find the post by ID
    //       const post = await Post.findById(postId);

    //       if (!post) {
    //         throw new ApolloError("Post not found");
    //       }

    //       // Create a new comment
    //       const comment = {
    //         text,
    //         author: context.user._id,
    //         post: post._id,
    //       };

    //       // Add the comment to the post's comments array
    //       post.comments.push(comment);
    //       await post.save();
    //        // Populate the comment's author field
    //       await comment.populate("author").execPopulate()
    //       // Return the populated comment
    //       return comment;
    //     } else {
    //       throw new AuthenticationError("You need to be logged in!");
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     throw new ApolloError("Failed to add a comment.");
    //   }
    // },

    // Add a like to a post
    addLike: async (parent, { postId }, context) => {
      try {
        if (context.user) {
          // Find the post by ID
          const post = await Post.findById(postId);

          if (!post) {
            throw new ApolloError("Post not found");
          }
          // Check if the user has already liked the post
          const userHasLiked = post.likes.includes(context.user._id);
          if (userHasLiked) {
            // If the user has already liked the post, remove their like
            post.likes.pull(context.user._id);
            // Remove the post from the user's likedPosts array
            await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { likedPosts: post._id } }
            );
          } else {
            // If the user has not liked the post, add their like
            post.likes.push(context.user._id);

            // Update the likedPosts array for the user
            await User.findOneAndUpdate(
              { _id: context.user._id },
              { $addToSet: { likedPosts: post._id } }
            );
          }

          await post.save();

          // Populate the author field of the post before returning it
          const populatedPost = await post.populate("author").execPopulate();

          // Return the updated post with the new like count
          return populatedPost;
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.error(err);
        throw new ApolloError("Failed to add a like.");
      }
    },
  },
};

module.exports = resolvers;
