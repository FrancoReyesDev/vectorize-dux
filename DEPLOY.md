# Despliegue con Docker

Este proyecto está configurado para ejecutarse fácilmente con Docker y Docker Compose.

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuración

1.  Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

    ```bash
    cp .env.example .env
    ```

2.  Asegúrate de que las variables de entorno sean correctas para tu entorno.

## Ejecución

Para iniciar todos los servicios (App, Qdrant, Ollama):

```bash
docker-compose up -d --build
```

Esto iniciará:

- **App**: En `http://localhost:3000`
- **Qdrant**: Base de datos vectorial en el puerto `6333`
- **Ollama**: Servicio de IA en el puerto `11434` (y descargará automáticamente el modelo `bge-m3`)

## Verificar estado

Puedes ver los logs de los contenedores con:

```bash
docker-compose logs -f
```

## Detener

Para detener los servicios:

```bash
docker-compose down
```
