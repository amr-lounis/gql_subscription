import { extendType, objectType } from 'nexus';
import { pubsub } from '../../utils';
import { withFilter } from 'graphql-subscriptions';

export const UserSubscription = extendType({
    type: 'Subscription',
    definition(t) {
        t.field('user_subscription', {
            type: objectType({
                name: 'userNotificationOut',
                definition(t) {
                    t.nullable.string('senderId');
                    t.nullable.string('receiverId');
                    t.nullable.string('title');
                    t.nullable.string('content');
                },
            }),
            args: {},
            subscribe: withFilter(
                () => pubsub.asyncIterator('user_notification_sender'),
                (payload, args, context, info) => {
                    if (context?.jwt?.id == payload?.receiverId) return true
                },
            ),
            resolve: async (payload, args, context, info) => {
                return new Promise((resolve, reject) => {
                    try {
                        resolve(payload);
                    } catch (error) {
                        reject(new Error('---- ERROR : subscription .'));
                    }
                })
            },
        });
    },
});