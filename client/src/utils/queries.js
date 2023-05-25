import { gql } from '@apollo/client';

export const QUERY_ME = gql`
query me {
  me {
    _id
    email
    username
    cocktails {
      _id
      name
      ingredients[
        {
          name
          quantity
        }
      ]
      imageURL
      glassware
      instructions
      tags[]
    }
  }
}
`;

export const QUERY_COCKTAILS = gql`
query cocktails {
  cocktails {
    _id
    name
    ingredients[
      {
        name
        quantity
      }
    ]
    glassware
    instructions
    tags[]
  }
}
`;