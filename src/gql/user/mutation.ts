import { extendType, nonNull, nullable, stringArg } from 'nexus';
import { pubsub } from '../../utils';
// **************************************************************************************************** 
export const UserMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('user_notification_send', {
            args: {
                receiverId: nonNull(stringArg()),
                title: nonNull(stringArg()),
                content: nonNull(stringArg()),
            },
            type: nullable("Boolean"),
            resolve: (parent, args: { senderId: string, receiverId: string, title: string, content: string }, context, info): boolean => {
                const payload = { senderId: context.jwt.id, receiverId: args.receiverId, title: args.title, content: args.content }
                pubsub.publish("user_notification_sender", payload);
                return true
            },
        });
    },
});
// **************************************************************************************************** 
