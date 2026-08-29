import { Params } from 'nestjs-pino';
import { uuidv7 } from 'uuidv7';

export const loggerConfig: Params = {
  pinoHttp: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    genReqId: (req, res) => {
      const existingId = req.id ?? req.headers['x-trace-id'] ?? req.headers['x-correlation-id'];
      if (existingId) return existingId;
      
      const id = uuidv7();
      res.setHeader('x-trace-id', id);
      return id;
    },
    customProps: (req) => ({
      traceId: req.id,
    }),
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        query: req.query,
        headers: {
          host: req.headers.host,
          'user-agent': req.headers['user-agent'],
        },
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  },
};

export { Logger, LoggerModule } from 'nestjs-pino';
export { pino } from 'pino';
