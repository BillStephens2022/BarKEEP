const { AuthenticationError } = require("apollo-server-express");
const { ApolloError } = require("apollo-server-errors");
const { User, Cocktail, Post } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // Resolver for fetching the logged-in user's profile
    me: async (parent, args, context) => {
      // Check if user is authenticated
      if (context.user) {
        // ... Logic to fetch and format user data ...
        const user = await User.findOne({ _id: context.user._id })
          .populate({
            path: "cocktails",
            model: "Cocktail",
          })
          .populate({
            path: "posts",
            model: "Post",
            populate: [
              {
                path: "author likes comments.author",
                model: "User",
              },
              {
                path: "recipe",
                model: "Cocktail",
              },
            ]
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
    // Resolver for fetching cocktails
    cocktails: async (parent, args) => {
      return await Cocktail.find({}).sort({ name: "asc" });
    },
    // Resolver for fetching posts
    posts: async (parent, args) => {
      return await Post.find({})
      // ... Logic to fetch and format post data - 
      // includes the posts author details and any comments (along with comment author) associated with the post.
        .populate({
          path: "author",
          model: "User",
          select: "username profilePhoto",
        })
        .populate({
          path: "comments",
          model: "Comment",
          populate: {
            path: "author",
            model: "User",
            select: "username profilePhoto",
          },
        })
        .populate("recipe");
    },
    // resolver for fetching an individial post and the list of users that "liked" it
    postLikesUsers: async (parent, { postId }, context) => {
      try {
        if (context.user) {
          // Find the post by ID and populate the likes field
          const post = await Post.findById(postId).populate("likes");

          if (!post) {
            throw new ApolloError("Post not found");
          }

          console.log("*****Post************: ", post);

          // Extract and return the users who liked the post
          const likedUsers = post.likes;
          console.log("likedUsers", likedUsers);
          return likedUsers;
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.error(err);
        throw new ApolloError("Failed to fetch liked users.");
      }
    },
    // Resolver for fetching a single post and populating with relevant detals such as author and comments
    // associated with the post (as well as comment author) and recipe if recipe was shared as part of the post.
    getSinglePost: async (parent, { postId }, context) => {
      try {
        if (context.user) {
          console.log("kicked off resolver");
          const post = await Post.findById(postId)
            .populate({
              path: "author",
              model: "User",
              select: "username profilePhoto",
            })
            .populate({
              path: "comments",
              model: "Comment",
              populate: {
                path: "author",
                model: "User",
                select: "username profilePhoto",
              },
            })
            .populate("recipe");

          if (!post) {
            throw new ApolloError("Post not found");
          }
          return post;
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.error(err);
        throw new ApolloError("Failed to fetch post.");
      }
    },
  },

  Mutation: {
    // Resolver for registering a new user
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
    // Resolver for user login
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
    // Resolver for adding a new cocktail
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
    // Resolver for deleting a cocktail
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
    // Resolver for editing a cocktail
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
    // Resolver for adding a new post
    addPost: async (parent, args, context) => {
      const { postTitle, postContent, postImageURL, postDate, recipe } = args;
      try {
        if (context.user) {
          const post = await Post.create({
            postTitle,
            postContent,
            postImageURL,
            postDate,
            author: context.user._id,
            recipe,
          });

          await User.findByIdAndUpdate(context.user._id, {
            $addToSet: { posts: post._id },
          });

          const populatedPost = await post
            .populate("author")
            .populate("recipe")
            .execPopulate();

          return populatedPost;
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.log(err);
        throw new ApolloError("Failed to create a new post.");
      }
    },
    // Resolver for deleting a post
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
    // Resolver for editing a profile photo
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

    // Resolver for adding a comment to a post
    addComment: async (parent, { postId, text }, context) => {
      try {
        if (context.user) {
          // Find the post by ID
          const post = await Post.findById(postId);

          if (!post) {
            throw new ApolloError("Post not found");
          }

          // Create a new comment instance
          const comment = {
            text,
            author: context.user._id,
          };

          // Add the comment to the post's comments array
          post.comments.push(comment);
          await post.save();

          // Populate the User's username and profilePhoto
          await post
            .populate({
              path: "comments.author",
              model: "User",
              select: "username profilePhoto",
            })
            .execPopulate();

          // Return the comment
          return post.comments[post.comments.length - 1];
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.error(err);
        throw new ApolloError("Failed to add a comment.");
      }
    },

    // Resolver for "liking" a post
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
