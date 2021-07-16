import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import { resolvers } from './Resolvers'
import { typeDefs } from './TypeDefs'

export const schema = makeExecutableSchema({ typeDefs, resolvers })

export const apollo = new ApolloServer({ schema })
