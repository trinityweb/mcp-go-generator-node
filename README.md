# MCP Go Generator Node.js

Un MCP (Model Context Protocol) eficiente en Node.js para generar microservicios Go con arquitectura hexagonal.

## 🚀 Características

- ✅ **Detección automática** del proyecto saas-mt
- ✅ **Generación de módulos** siguiendo convenciones del proyecto
- ✅ **Arquitectura hexagonal** completa
- ✅ **Repositorios PostgreSQL** con patrón correcto
- ✅ **Controladores HTTP** con estructura estándar
- ✅ **Manejo de errores** con exception package
- ✅ **Criterios de búsqueda** usando sharedCriteria

## 📦 Instalación

```bash
cd mcp/mcp-go-generator-node
npm install
```

## 🔧 Configuración en Cursor

Agregar al archivo de configuración MCP de Cursor:

```json
{
  "mcpServers": {
    "mcp-go-generator-node": {
      "command": "node",
      "args": ["/Users/hornosg/MyProjects/saas-mt/mcp/mcp-go-generator-node/src/index.js"],
      "cwd": "/Users/hornosg/MyProjects/saas-mt"
    }
  }
}
```

## 🛠️ Comandos Disponibles

### `add_module_to_service`
Agrega un nuevo módulo a un servicio Go existente.

**Parámetros:**
- `service_path`: Ruta al servicio (ej: "saas-mt-pim-service")
- `module_name`: Nombre del módulo (ej: "attribute")
- `entities`: Lista de entidades para el módulo (opcional)

**Ejemplo:**
```javascript
{
  "service_path": "saas-mt-pim-service",
  "module_name": "attribute",
  "entities": ["attribute"]
}
```

### `show_project_status`
Muestra el estado actual del proyecto y servicios disponibles.

### `create_go_service`
Crear un nuevo microservicio Go completo (en desarrollo).

## 📁 Estructura Generada

```
src/
├── {module_name}/
│   ├── domain/
│   │   ├── entity/
│   │   │   └── {entity}.go
│   │   ├── port/
│   │   │   └── {entity}_repository.go
│   │   └── exception/
│   │       └── errors.go
│   ├── application/
│   │   ├── usecase/
│   │   ├── request/
│   │   └── response/
│   └── infrastructure/
│       ├── persistence/
│       │   └── repository/
│       │       └── {entity}_postgres_repository.go
│       └── controller/
│           └── http_handler.go
```

## ✨ Ventajas sobre la versión Python

- 🚀 **Más rápido**: Node.js es más eficiente para este tipo de operaciones
- 🔧 **Más estable**: Menos problemas de dependencias y configuración
- 📝 **Mejor manejo de archivos**: fs-extra proporciona operaciones más robustas
- 🎯 **Detección más precisa**: Mejor algoritmo de detección del proyecto
- 💾 **Menor uso de memoria**: Más eficiente en recursos

## 🔄 Migración desde Python

El MCP en Node.js reemplaza completamente al de Python. Simplemente:

1. Instala las dependencias: `npm install`
2. Actualiza la configuración de Cursor
3. Reinicia Cursor
4. ¡Listo para usar!

## 🐛 Debugging

Para ver logs del MCP:
```bash
npm run dev
```

## 📋 TODO

- [ ] Implementar `create_go_service` completo
- [ ] Agregar generación de casos de uso
- [ ] Agregar generación de migraciones
- [ ] Agregar validaciones de requests
- [ ] Integración con Kong y Postman 