# Email Service

Microservicio de correos electrónicos construido con NestJS, usando RabbitMQ para la comunicación inter-servicios y BullMQ/Redis para el encolado asíncrono y control de concurrencia. El servicio utiliza Brevo (TS API) para el envío final de los correos.

## Arquitectura

- **RabbitMQ**: Recibe los mensajes con el patrón `send_email` o `send_bulk_emails`.
- **Redis & BullMQ**: Encola los emails de manera persistente con reintentos configurables (backoff exponencial).
- **Handlebars**: Compila asíncronamente las plantillas en `src/templates/*.hbs` para los correos.
- **Provider Pattern**: Permite cambiar fácilmente de proveedor de email implementando la interfaz `IEmailProvider`.
- **Hybrid App**: Combina microservicio (RMQ) y servidor HTTP (para Check de salud).

## Variables de Entorno (.env)

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `PORT` | Puerto de servidor HTTP (Health Check) | 3000 |
| `REDIS_HOST` | Host de Redis para BullMQ | localhost |
| `REDIS_PORT` | Puerto de Redis | 6379 |
| `RABBITMQ_URL` | URL de conexión a RabbitMQ | amqp://localhost:5672 |
| `RABBITMQ_QUEUE` | Cola en RabbitMQ para escuchar | emails_queue |
| `BREVO_API_KEY` | API Key de Brevo |

## Ejecución Local

1. Levantar Redis y RabbitMQ
```bash
# Redis
docker run -p 6379:6379 -d redis:alpine

# RabbitMQ
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
```

2. Instalar dependencias
```bash
npm install
```

3. Ejecutar en modo desarrollo
```bash
npm run start:dev
```

## Health Checks

El servicio expone un servidor HTTP para comprobar la salud de la aplicación.
- Ruta: `GET /health`
- Respuesta: Estado de memoria (heap) y conexión a Redis de las colas.

## Tests

```bash
# Unit tests
npm run test
```
