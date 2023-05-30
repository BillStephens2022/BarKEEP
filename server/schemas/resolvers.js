const { AuthenticationError } = require("apollo-server-express");
const { User, Cocktail } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // me: User
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate('cocktails');
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    cocktails: async (parent, args) => {
      
     
      return await Cocktail.find({}).sort({ name: 'asc' });

      
    
    },
  },
  Mutation: {
    // addUser
    addUser: async (parent, { username, email, password }) => {
      console.log('back end response: ', username, email, password);
      const user = await User.create({ username, email, password });
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
    addCocktail: async (parent, { name, ingredients, imageURL, glassware, instructions, tags }, context) => {
      try {
        if (context.user) {
          console.log('trying to add cocktail!')
          console.log(context.user.username);
          const cocktail = await Cocktail.create(
            {
              name,
              ingredients,
              imageURL,
              glassware,
              instructions,
              tags
            }
          );

          console.log("cocktail", cocktail);
          console.log("context.user._id", context.user._id);

          const user = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { cocktails: cocktail._id } }
          );
          console.log(cocktail);
          console.log(user);
          return cocktail;

        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (err) {
        console.log(err);
        throw new AuthenticationError(err);
      }
    },
    // delete a transaction
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
      throw new AuthenticationError('You need to be logged in!');
    }
   }
};

module.exports = resolvers;