type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

const LOG_PREFIX = '[product-labels]';

const formatMessage = (
  level: LogLevel,
  message: string,
  context?: LogContext
) => {
  const timestamp = new Date().toISOString();
  const payload = context ? ` ${JSON.stringify(context)}` : '';
  return `${timestamp} ${LOG_PREFIX} [${level.toUpperCase()}] ${message}${payload}`;
};

export const logger = {
  debug(message: string, context?: LogContext) {
    console.debug(formatMessage('debug', message, context));
  },
  info(message: string, context?: LogContext) {
    console.info(formatMessage('info', message, context));
  },
  warn(message: string, context?: LogContext) {
    console.warn(formatMessage('warn', message, context));
  },
  error(message: string, context?: LogContext) {
    console.error(formatMessage('error', message, context));
  },
};
