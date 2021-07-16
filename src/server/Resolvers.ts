import { database } from './Database'
import { pubsub } from './PubSub'
import { withFilter } from 'graphql-subscriptions'

export const resolvers = {
    Query: {
        users: async () => {
            const users = await database.user.findMany()

            return users
        },
        channels: async () => {
            const channels = await database.channel.findMany()

            return channels
        },
    },
    Mutation: {
        sendMessage: async (_: any, args: any) => {
            // console.log(args)

            const message = await database.message.create({
                data: {
                    userId: args.userId,
                    channelId: args.channelId,
                    body: args.body,
                },
            })

            await pubsub.publish('message', { messageId: message.id, channelId: message.channelId })

            return message
        },
    },
    Subscription: {
        messageOnChannel: {
            resolve: async (payload: { messageId: string; channelId: string }) => {
                // console.log({ payload })

                const message = await database.message.findFirst({ where: { id: payload.messageId } })

                return message
            },
            subscribe: withFilter(
                () => pubsub.asyncIterator('message'),
                (payload, args) => {
                    return payload.channelId === args.channelId
                }
            ),
        },
    },
}
