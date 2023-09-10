const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} = require('graphql');

const app = express();

const books = [
  // Harry Potter series
  {
    id: 1,
    name: "Harry Potter and the Philosopher's Stone",
    authorId: 1,
  },
  {
    id: 2,
    name: 'Harry Potter and the Chamber of Secrets',
    authorId: 1,
  },
  {
    id: 3,
    name: 'Harry Potter and the Prisoner of Azkaban',
    authorId: 1,
  },

  // The Lord of the Rings series
  {
    id: 4,
    name: 'The Fellowship of the Ring',
    authorId: 2,
  },
  {
    id: 5,
    name: 'The Two Towers',
    authorId: 2,
  },

  // The Hunger Games series
  {
    id: 6,
    name: 'The Hunger Games',
    authorId: 3,
  },
  {
    id: 7,
    name: 'Catching Fire',
    authorId: 3,
  },
  {
    id: 8,
    name: 'Mockingjay',
    authorId: 3,
  },
];

const authors = [
  {
    id: 1,
    name: 'J.K. Rowling',
  },
  {
    id: 2,
    name: 'J.R.R. Tolkien',
  },
  {
    id: 3,
    name: 'Suzanne Collins',
  },
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book wrotten by an author.',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents a author of a book.',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a Book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add a Author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => console.log('Server is running on port 5000'));
