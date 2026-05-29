import pino from 'pino';
import { AsyncLocalStorage } from 'async_hooks';
export const asyncLocalStorage = new AsyncLocalStorage<{ traceId: string }>();

const loggerOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  mixin() {
    const store = asyncLocalStorage.getStore();
    return store ? { traceId: store.traceId } : {};
  },
};

if (process.env.NODE_ENV !== 'production') {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

const baseLogger = pino(loggerOptions);

export const getLogger = (moduleName: string) =>
  baseLogger.child({
    module: moduleName,
  });

export default getLogger('App');
