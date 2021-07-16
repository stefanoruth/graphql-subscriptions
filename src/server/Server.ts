import express from 'express'
import { createServer } from 'http'
import { apollo, schema } from './ApolloServer'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { pubsub } from './PubSub'
import { createTerminus } from '@godaddy/terminus'
import { database } from './Database'

export async function startServer() {
    await apollo.start()

    await database.$connect()

    const app = express()

    apollo.applyMiddleware({ app })

    const httpServer = createServer(app)

    const subscriptionServer = SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: apollo.graphqlPath }
    )

    createTerminus(httpServer, {
        onShutdown: () => Promise.all([apollo.stop(), subscriptionServer.close(), database.$disconnect()]),
    })

    await new Promise<void>(resolve => httpServer.listen(4000, resolve))

    console.log(`🚀 Server ready at http://localhost:4000${apollo.graphqlPath}`)
}
