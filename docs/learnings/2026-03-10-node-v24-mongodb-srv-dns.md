# Node v24 rompe resolucion DNS SRV de MongoDB Atlas (mongodb+srv)

**Fecha:** 2026-03-10
**Proyecto:** bot-config-dc (BotHada)

## Contexto

El bot se conectaba a MongoDB Atlas usando una URI con `mongodb+srv://` y funcionaba correctamente con Node v20.14. Al actualizar a Node v24.14, la conexion fallo con error `ECONNREFUSED querySrv`.

## Descubrimiento

Node v24 introdujo cambios en la resolucion DNS que afectan las queries SRV usadas por `mongodb+srv://`. El error especifico es:

```
Error: querySrv ECONNREFUSED _mongodb._tcp.cluster.xxxxx.mongodb.net
```

La URI con `mongodb+srv://` depende de DNS SRV records para descubrir los nodos del cluster. Node v24 falla al resolver estos records en ciertas redes/configuraciones DNS.

**Solucion:** Usar la URI estandar `mongodb://` (sin `+srv`) que conecta directamente a los nodos del cluster sin depender de DNS SRV:

```
# En vez de:
mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/db

# Usar:
mongodb://user:pass@shard-00-00.xxxxx.mongodb.net:27017,shard-00-01.xxxxx.mongodb.net:27017,shard-00-02.xxxxx.mongodb.net:27017/db?ssl=true&replicaSet=...&authSource=admin
```

Esta URI se obtiene en MongoDB Atlas → Connect → Drivers, seleccionando la opcion de connection string sin SRV.

## Aplicacion

Al actualizar Node a v24+ en cualquier proyecto que use MongoDB Atlas con `mongodb+srv://`, verificar que la conexion siga funcionando. Si falla con `ECONNREFUSED querySrv`, cambiar a la URI estandar sin SRV. La funcionalidad y seguridad son identicas.

> **Nota para el equipo:** Este learning podria ser util a nivel de ATLAS (transversal a todos los proyectos). Consultar con Jorge Bossa o Kevin Guerra para evaluar su inclusion.
