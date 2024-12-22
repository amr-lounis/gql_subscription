import { extendType, nonNull, stringArg } from 'nexus';
import { MyToken } from '../../utils';
// **************************************************************************************************** 
export const UserQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('user_authentication', {
            args: { id: nonNull(stringArg()) },
            type: nonNull("String"),
            resolve: (parent, args: { id: string }, context, info): Promise<string> => {
                return MyToken.Token_Create(args.id, null)
            },
        });
    }
});
// **************************************************************************************************** 