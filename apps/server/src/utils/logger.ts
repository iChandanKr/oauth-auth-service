import pino from 'pino';
import { AsyncLocalStorage } from 'async_hooks';
export const asyncLocalStorage = new AsyncLocalStorage<{ traceId: string }>();

const baseLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
      : undefined as any,
});

export const getLogger = (moduleName: string) => {
  return baseLogger.child({
    module: moduleName,
  }, {
    mixin() {
      const store = asyncLocalStorage.getStore();
      return store ? { traceId: store.traceId } : {};
    }
  } as any);
};

export default getLogger('App');
