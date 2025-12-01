const winston = require('winston');

// Definir formatos de log
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // Capturar stack trace en errores
  winston.format.json() // Formato JSON estructurado (ideal para herramientas de monitoreo)
);

// Crear la instancia del logger
const logger = winston.createLogger({
  level: 'info', // Nivel mínimo a registrar (info, warn, error)
  format: logFormat,
  defaultMeta: { service: 'api-veterinaria' }, // Etiqueta para identificar el servicio
  transports: [
    // 1. Escribir logs de error en un archivo dedicado
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    
    // 2. Escribir todos los logs en un archivo general
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Si no estamos en producción, también mostrar en consola con colores
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple() // Formato más leíble para humanos en desarrollo
    ),
  }));
}

// Wrapper para sanitizar datos sensibles antes de loguear (Defensa en Profundidad)
// Evita que por error loguees passwords o tokens
logger.safeError = (message, meta = {}) => {
    // Clonamos el objeto para no modificar el original
    const safeMeta = { ...meta };
    if (safeMeta.password) safeMeta.password = '[REDACTED]';
    if (safeMeta.token) safeMeta.token = '[REDACTED]';
    
    logger.error(message, safeMeta);
};

module.exports = logger;