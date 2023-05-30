import { gql } from '@apollo/client';

export const QUERY_ME = gql`
query Me {
    me {
      _id
      email
      username
      cocktails {
        _id
        glassware
        imageURL
        ingredients {
          name
          quantity
        }
        instructions
        name
        tags
      }
    }
  }
`;

export const QUERY_COCKTAILS = gql`
query Cocktails {
  cocktails {
    _id
    glassware
    imageURL
    ingredients {
      name
      quantity
    }
    instructions
    name
    tags
  }
}
`;