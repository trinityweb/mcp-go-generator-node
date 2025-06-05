# Ejemplos de Uso - MCP Go Generator Node.js

## 🚀 Comandos Básicos

### 1. Mostrar Estado del Proyecto

```javascript
// Comando: show_project_status
// Parámetros: ninguno
{}
```

**Resultado esperado:**
- Lista de servicios disponibles
- Tipos de servicios (Go, Node.js)
- Estado del MCP

### 2. Agregar Módulo a Servicio Existente

```javascript
// Comando: add_module_to_service
{
  "service_path": "saas-mt-pim-service",
  "module_name": "attribute",
  "entities": ["attribute"]
}
```

**Resultado esperado:**
- Estructura completa del módulo
- Entidad con campos estándar
- Repositorio PostgreSQL
- Controlador HTTP
- Manejo de excepciones

### 3. Agregar Múltiples Entidades

```javascript
// Comando: add_module_to_service
{
  "service_path": "saas-mt-pim-service",
  "module_name": "catalog",
  "entities": ["category", "product", "variant"]
}
```

**Resultado esperado:**
- Tres entidades: Category, Product, Variant
- Repositorios para cada entidad
- Controlador unificado
- Excepciones compartidas

## 📁 Estructura Generada

### Módulo Básico (sin entidades)
```
src/
└── {module_name}/
    ├── domain/
    │   ├── entity/
    │   ├── port/
    │   └── exception/
    │       └── errors.go
    ├── application/
    │   ├── usecase/
    │   ├── request/
    │   └── response/
    └── infrastructure/
        ├── persistence/
        │   └── repository/
        └── controller/
            └── http_handler.go
```

### Módulo con Entidades
```
src/
└── attribute/
    ├── domain/
    │   ├── entity/
    │   │   └── attribute.go
    │   ├── port/
    │   │   └── attribute_repository.go
    │   └── exception/
    │       └── errors.go
    ├── application/
    │   ├── usecase/
    │   ├── request/
    │   └── response/
    └── infrastructure/
        ├── persistence/
        │   └── repository/
        │       └── attribute_postgres_repository.go
        └── controller/
            └── http_handler.go
```

## 🎯 Casos de Uso Comunes

### Caso 1: Módulo de Gestión de Usuarios (IAM)
```javascript
{
  "service_path": "saas-mt-iam-service",
  "module_name": "user",
  "entities": ["user", "role", "permission"]
}
```

### Caso 2: Módulo de Inventario (Stock)
```javascript
{
  "service_path": "saas-mt-stock-service",
  "module_name": "inventory",
  "entities": ["item", "location", "movement"]
}
```

### Caso 3: Módulo de Configuración (PIM)
```javascript
{
  "service_path": "saas-mt-pim-service",
  "module_name": "configuration",
  "entities": ["setting", "template"]
}
```

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
# Opcional: Configurar directorio del proyecto
export SAAS_ROOT="/Users/hornosg/MyProjects/saas-mt"

# Opcional: Modo de desarrollo
export NODE_ENV="development"
```

### Configuración de Cursor con Variables
```json
{
  "mcpServers": {
    "mcp-go-generator-node": {
      "command": "node",
      "args": ["${workspaceFolder}/mcp/mcp-go-generator-node/src/index.js"],
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "production",
        "SAAS_ROOT": "${workspaceFolder}"
      }
    }
  }
}
```

## 🐛 Solución de Problemas

### Error: "No se pudo detectar la raíz del proyecto saas-mt"
**Solución:**
1. Verificar que estés en el directorio correcto
2. Asegurar que existe el directorio `services/`
3. Configurar variable `SAAS_ROOT` si es necesario

### Error: "El servicio X no existe"
**Solución:**
1. Verificar el nombre exacto del servicio
2. Usar nombres como: `saas-mt-pim-service`, `saas-mt-iam-service`
3. Ejecutar `show_project_status` para ver servicios disponibles

### Error: "MCP no responde"
**Solución:**
1. Verificar que Node.js esté instalado
2. Ejecutar `npm install` en el directorio del MCP
3. Reiniciar Cursor
4. Verificar la configuración JSON

## 📝 Próximos Pasos

Después de generar un módulo:

1. **Implementar casos de uso** en `application/usecase/`
2. **Agregar validaciones** en `application/request/`
3. **Completar controladores** en `infrastructure/controller/`
4. **Crear migraciones** de base de datos
5. **Registrar módulo** en `main.go` y `wire.go`

## 🔗 Enlaces Útiles

- [Repositorio GitHub](https://github.com/hornosg/mcp-go-generator-node)
- [Documentación MCP](https://modelcontextprotocol.io/)
- [Arquitectura Hexagonal](https://alistair.cockburn.us/hexagonal-architecture/) 