import { createClient } from 'redis';
import { REDIS_CLIENT } from './constant/redis.constant';

export const redisProvider = [
  {
    provide: REDIS_CLIENT,
    useFactory: async () => {
      const client = createClient({
        url: 'redis://default:159624@localhost:6379',
        username: 'chan',
        password: '159624',
      });
      await client.connect();
      return client;
    },
  },
];
