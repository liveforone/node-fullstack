"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisProvider = void 0;
const redis_1 = require("redis");
const redis_constant_1 = require("./constant/redis.constant");
exports.redisProvider = [
    {
        provide: redis_constant_1.REDIS_CLIENT,
        useFactory: async () => {
            const client = (0, redis_1.createClient)({
                url: 'redis://default:159624@localhost:6379',
            });
            await client.connect();
            return client;
        },
    },
];
//# sourceMappingURL=redis.provider.js.map