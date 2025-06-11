#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear función de logging
function logToFile(message) {
  const logPath = '/Users/hornosg/MyProjects/saas-mt/mcp_debug.log';
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

class GoGeneratorMCP {
  constructor() {
    this.server = new Server(
      {
        name: 'mcp-go-generator-node',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'add_module_to_service',
          description: 'Agregar un nuevo módulo a un servicio Go existente',
          inputSchema: {
            type: 'object',
            properties: {
              service_path: {
                type: 'string',
                description: 'Ruta al servicio (ej: "saas-mt-pim-service")',
              },
              module_name: {
                type: 'string',
                description: 'Nombre del módulo (ej: "attribute")',
              },
              entities: {
                type: 'array',
                items: { type: 'string' },
                description: 'Lista de entidades para el módulo',
                default: [],
              },
            },
            required: ['service_path', 'module_name'],
          },
        },
        {
          name: 'create_go_service',
          description: 'Crear un nuevo microservicio Go con arquitectura hexagonal',
          inputSchema: {
            type: 'object',
            properties: {
              service_name: {
                type: 'string',
                description: 'Nombre del nuevo servicio (ej: "user-management")',
              },
              port: {
                type: 'string',
                description: 'Puerto para el servicio (ej: "8085")',
                default: '8085',
              },
              modules: {
                type: 'array',
                items: { type: 'string' },
                description: 'Lista de módulos a crear',
                default: [],
              },
            },
            required: ['service_name'],
          },
        },
        {
          name: 'show_project_status',
          description: 'Mostrar el estado actual del proyecto y servicios',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'analyze_usecase_workflow',
          description: 'Analizar un caso de uso y generar roadmap completo con todos los componentes necesarios',
          inputSchema: {
            type: 'object',
            properties: {
              service_path: {
                type: 'string',
                description: 'Ruta al servicio (ej: "saas-mt-pim-service")',
              },
              module_name: {
                type: 'string',
                description: 'Nombre del módulo (ej: "marketplace")',
              },
              usecase_description: {
                type: 'string',
                description: 'Descripción del caso de uso (ej: "Crear categoría marketplace con validaciones")',
              },
              business_rules: {
                type: 'array',
                items: { type: 'string' },
                description: 'Reglas de negocio específicas',
                default: [],
              },
              integration_points: {
                type: 'array',
                items: { type: 'string' },
                description: 'Puntos de integración con otros servicios',
                default: [],
              },
            },
            required: ['service_path', 'module_name', 'usecase_description'],
          },
        },
        {
          name: 'generate_workflow_roadmap',
          description: 'Generar roadmap detallado paso a paso para implementar un flujo completo',
          inputSchema: {
            type: 'object',
            properties: {
              workflow_type: {
                type: 'string',
                enum: ['crud_complete', 'business_flow', 'integration_flow', 'custom'],
                description: 'Tipo de flujo a implementar',
              },
              entity_name: {
                type: 'string',
                description: 'Nombre de la entidad principal',
              },
              operations: {
                type: 'array',
                items: { type: 'string', enum: ['create', 'read', 'update', 'delete', 'list', 'search', 'validate'] },
                description: 'Operaciones a implementar',
                default: ['create', 'read', 'update', 'delete', 'list'],
              },
              complexity_level: {
                type: 'string',
                enum: ['simple', 'medium', 'complex'],
                description: 'Nivel de complejidad del flujo',
                default: 'medium',
              },
            },
            required: ['workflow_type', 'entity_name'],
          },
        },
        {
          name: 'generate_component_by_step',
          description: 'Generar un componente específico siguiendo el roadmap paso a paso',
          inputSchema: {
            type: 'object',
            properties: {
              service_path: {
                type: 'string',
                description: 'Ruta al servicio',
              },
              module_name: {
                type: 'string',
                description: 'Nombre del módulo',
              },
              component_type: {
                type: 'string',
                enum: ['entity', 'port', 'usecase', 'request', 'response', 'repository', 'controller', 'criteria_builder', 'mapper', 'object_mother', 'integration_test'],
                description: 'Tipo de componente a generar',
              },
              entity_name: {
                type: 'string',
                description: 'Nombre de la entidad',
              },
              operation_name: {
                type: 'string',
                description: 'Nombre de la operación (ej: "create", "update")',
                default: '',
              },
              dependencies: {
                type: 'array',
                items: { type: 'string' },
                description: 'Dependencias del componente',
                default: [],
              },
              business_rules: {
                type: 'array',
                items: { type: 'string' },
                description: 'Reglas de negocio específicas',
                default: [],
              },
            },
            required: ['service_path', 'module_name', 'component_type', 'entity_name'],
          },
        },
        {
          name: 'generate_integration_scripts',
          description: 'Generar scripts de integración (curl, postman, tests E2E) para un flujo completo',
          inputSchema: {
            type: 'object',
            properties: {
              service_path: {
                type: 'string',
                description: 'Ruta al servicio',
              },
              module_name: {
                type: 'string',
                description: 'Nombre del módulo',
              },
              entity_name: {
                type: 'string',
                description: 'Nombre de la entidad',
              },
              endpoints: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    method: { type: 'string' },
                    path: { type: 'string' },
                    description: { type: 'string' },
                    requires_auth: { type: 'boolean', default: true },
                    requires_tenant: { type: 'boolean', default: true },
                  },
                },
                description: 'Endpoints a testear',
                default: [],
              },
              test_scenarios: {
                type: 'array',
                items: { type: 'string' },
                description: 'Escenarios de prueba específicos',
                default: ['happy_path', 'validation_errors', 'not_found', 'unauthorized'],
              },
            },
            required: ['service_path', 'module_name', 'entity_name'],
          },
        },
        {
          name: 'update_project_tracking',
          description: 'Actualizar documentación de tracking del proyecto con progreso de implementación',
          inputSchema: {
            type: 'object',
            properties: {
              tracking_file: {
                type: 'string',
                description: 'Ruta al archivo de tracking',
                default: 'documentation/PROJECT_TRACKING.md',
              },
              completed_tasks: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    task_name: { type: 'string' },
                    component_type: { type: 'string' },
                    completion_date: { type: 'string' },
                    notes: { type: 'string' },
                  },
                },
                description: 'Tareas completadas a marcar',
                default: [],
              },
              new_tasks: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    task_name: { type: 'string' },
                    description: { type: 'string' },
                    priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                    estimated_time: { type: 'string' },
                  },
                },
                description: 'Nuevas tareas a agregar',
                default: [],
              },
            },
            required: ['tracking_file'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'add_module_to_service':
            return await this.addModuleToService(args);
          case 'create_go_service':
            return await this.createGoService(args);
          case 'show_project_status':
            return await this.showProjectStatus(args);
          case 'analyze_usecase_workflow':
            return await this.analyzeUsecaseWorkflow(args);
          case 'generate_workflow_roadmap':
            return await this.generateWorkflowRoadmap(args);
          case 'generate_component_by_step':
            return await this.generateComponentByStep(args);
          case 'generate_integration_scripts':
            return await this.generateIntegrationScripts(args);
          case 'update_project_tracking':
            return await this.updateProjectTracking(args);
          default:
            throw new Error(`Herramienta desconocida: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  // Detectar la raíz del proyecto saas-mt
  detectProjectRoot() {
    logToFile(`[DEBUG] NEW detectProjectRoot function called`);
    
    // Obtener la ubicación del script actual
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    logToFile(`[DEBUG] Script directory: ${scriptDir}`);
    
    // Desde mcp/mcp-go-generator-node/src/ necesitamos subir 3 niveles para llegar a saas-mt/
    const projectRoot = path.resolve(scriptDir, '../../../');
    logToFile(`[DEBUG] Calculated project root: ${projectRoot}`);
    
    // Verificar que existe y tiene la estructura esperada
    const hasServices = fs.existsSync(path.join(projectRoot, 'services'));
    const hasDockerCompose = fs.existsSync(path.join(projectRoot, 'docker-compose.yml'));
    const hasGoMod = fs.existsSync(path.join(projectRoot, 'go.mod'));
    
    logToFile(`[DEBUG] Project root exists: ${fs.existsSync(projectRoot)}`);
    logToFile(`[DEBUG] Has services: ${hasServices}`);
    logToFile(`[DEBUG] Has docker-compose: ${hasDockerCompose}`);
    logToFile(`[DEBUG] Has go.mod: ${hasGoMod}`);
    
    if (fs.existsSync(projectRoot) && hasServices && (hasDockerCompose || hasGoMod)) {
      logToFile(`[DEBUG] Project root confirmed: ${projectRoot}`);
      return projectRoot;
    }
    
    // Fallback: buscar hacia arriba desde el directorio de trabajo actual
    let currentDir = process.cwd();
    logToFile(`[DEBUG] Fallback search from: ${currentDir}`);
    
    while (currentDir !== path.dirname(currentDir)) {
      const currentHasServices = fs.existsSync(path.join(currentDir, 'services'));
      const currentHasDockerCompose = fs.existsSync(path.join(currentDir, 'docker-compose.yml'));
      
      logToFile(`[DEBUG] Checking ${currentDir}: services=${currentHasServices}, docker=${currentHasDockerCompose}`);
      
      if (currentHasServices && currentHasDockerCompose) {
        logToFile(`[DEBUG] Found project root via fallback: ${currentDir}`);
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    
    logToFile(`[DEBUG] All detection methods failed`);
    throw new Error('No se pudo detectar la raíz del proyecto saas-mt');
  }

  async addModuleToService(args) {
    const { service_path, module_name, entities = [] } = args;
    
    try {
      const projectRoot = this.detectProjectRoot();
      const servicesRoot = path.join(projectRoot, 'services');
      const servicePath = path.join(servicesRoot, service_path);
      
      // Verificar que el servicio existe
      if (!fs.existsSync(servicePath)) {
        const availableServices = fs.readdirSync(servicesRoot)
          .filter(item => fs.statSync(path.join(servicesRoot, item)).isDirectory())
          .filter(item => item.startsWith('saas-mt-'));
        
        return {
          content: [
            {
              type: 'text',
              text: `❌ El servicio ${service_path} no existe en ${servicesRoot}

💡 Servicios disponibles:
${availableServices.map(s => `- ${s}`).join('\n')}

📝 Uso correcto: 
- Para PIM: service_path = "saas-mt-pim-service"
- Para IAM: service_path = "saas-mt-iam-service"
- Para Stock: service_path = "saas-mt-stock-service"`,
            },
          ],
        };
      }

      // Extraer el nombre del servicio para imports
      let serviceName = path.basename(servicePath);
      if (serviceName.startsWith('saas-mt-') && serviceName.endsWith('-service')) {
        serviceName = serviceName.slice(8, -8); // Remover "saas-mt-" y "-service"
      }

      // Crear estructura del módulo
      const modulePath = path.join(servicePath, 'src', module_name);
      
      const dirs = [
        'domain/entity',
        'domain/port',
        'domain/exception',
        'application/usecase',
        'application/request',
        'application/response',
        'infrastructure/persistence/repository',
        'infrastructure/controller',
      ];

      // Crear directorios
      for (const dir of dirs) {
        await fs.ensureDir(path.join(modulePath, dir));
      }

      const entitiesCreated = [];

      // Generar archivos para cada entidad
      for (const entity of entities) {
        const entityName = entity;
        const entityClass = entity.replace(/_/g, '').replace(/^\w/, c => c.toUpperCase());
        
        // 1. Entidad
        const entityContent = this.generateEntityFile(entityName, entityClass);
        await fs.writeFile(path.join(modulePath, 'domain', 'entity', `${entityName}.go`), entityContent);
        
        // 2. Repository Port
        const portContent = this.generateRepositoryPort(entityName, entityClass, serviceName, module_name);
        await fs.writeFile(path.join(modulePath, 'domain', 'port', `${entityName}_repository.go`), portContent);
        
        // 3. PostgreSQL Repository
        const repoContent = this.generatePostgresRepository(entityName, entityClass, serviceName, module_name);
        await fs.writeFile(path.join(modulePath, 'infrastructure', 'persistence', 'repository', `${entityName}_postgres_repository.go`), repoContent);
        
        entitiesCreated.push(entityName);
      }

      // 4. Domain Exceptions (solo si no existe)
      const exceptionFile = path.join(modulePath, 'domain', 'exception', 'errors.go');
      if (!fs.existsSync(exceptionFile)) {
        const exceptionContent = this.generateExceptionFile(entities[0] || module_name);
        await fs.writeFile(exceptionFile, exceptionContent);
      }

      // 5. HTTP Controller (solo si no existe)
      const controllerFile = path.join(modulePath, 'infrastructure', 'controller', 'http_handler.go');
      if (!fs.existsSync(controllerFile)) {
        const controllerContent = this.generateControllerFile(entities[0] || module_name, serviceName, module_name);
        await fs.writeFile(controllerFile, controllerContent);
      }

      return {
        content: [
          {
            type: 'text',
            text: `✅ Módulo '${module_name}' agregado exitosamente al servicio '${service_path}'

📁 Ubicación: ${modulePath}

📁 Estructura creada:
- domain/entity/
- domain/port/
- domain/exception/
- application/usecase/
- infrastructure/persistence/repository/
- infrastructure/controller/

🎯 Entidades generadas: ${entitiesCreated.length > 0 ? entitiesCreated.join(', ') : 'Ninguna (módulo base)'}

📝 Archivos creados siguiendo convenciones del proyecto:
- ✅ Repositorios PostgreSQL con patrón ${module_name.charAt(0).toUpperCase() + module_name.slice(1)}PostgresRepository
- ✅ Controladores HTTP con nombre http_handler.go
- ✅ Uso correcto de sharedCriteria.SQLCriteriaConverter
- ✅ Manejo de errores con exception package
- ✅ Estructura de entidades con campos estándar (ID, TenantID, Name, Active, CreatedAt, UpdatedAt)
- ✅ Imports correctos usando "${serviceName}/src/${module_name}/..."

⚠️  Próximos pasos:
1. Implementar los casos de uso específicos
2. Agregar validaciones en los requests
3. Completar los controladores HTTP
4. Crear migraciones de base de datos
5. Registrar el módulo en main.go y wire.go

🔧 Para eliminar el módulo:
rm -rf ${modulePath}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Error agregando módulo: ${error.message}`);
    }
  }

  generateEntityFile(entityName, entityClass) {
    return `package entity

import (
\t"fmt"
\t"time"
\t"github.com/google/uuid"
)

// ${entityClass} representa la entidad ${entityName}
type ${entityClass} struct {
\tID        string    \`json:"id"\`
\tTenantID  string    \`json:"tenant_id"\`
\tName      string    \`json:"name"\`
\tActive    bool      \`json:"active"\`
\tCreatedAt time.Time \`json:"created_at"\`
\tUpdatedAt time.Time \`json:"updated_at"\`
}

// New${entityClass} crea una nueva instancia de ${entityClass}
func New${entityClass}(tenantID, name string) (*${entityClass}, error) {
\tif tenantID == "" {
\t\treturn nil, fmt.Errorf("tenant_id es requerido")
\t}
\tif name == "" {
\t\treturn nil, fmt.Errorf("name es requerido")
\t}
\t
\tnow := time.Now()
\treturn &${entityClass}{
\t\tID:        uuid.New().String(),
\t\tTenantID:  tenantID,
\t\tName:      name,
\t\tActive:    true,
\t\tCreatedAt: now,
\t\tUpdatedAt: now,
\t}, nil
}

// Update actualiza los campos de la entidad
func (e *${entityClass}) Update() {
\te.UpdatedAt = time.Now()
}
`;
  }

  generateRepositoryPort(entityName, entityClass, serviceName, moduleName) {
    return `package port

import (
\t"context"
\t"${serviceName}/src/${moduleName}/domain/entity"
\t"pim/src/shared/domain/criteria"
)

// ${entityClass}Repository define los métodos para persistir ${entityClass}
type ${entityClass}Repository interface {
\tCreate(ctx context.Context, ${entityName} *entity.${entityClass}) error
\tUpdate(ctx context.Context, ${entityName} *entity.${entityClass}) error
\tFindByID(ctx context.Context, id string, tenantID string) (*entity.${entityClass}, error)
\tFindByTenant(ctx context.Context, tenantID string) ([]*entity.${entityClass}, error)
\tDelete(ctx context.Context, id string, tenantID string) error
\tSearchByCriteria(ctx context.Context, crit criteria.Criteria) ([]*entity.${entityClass}, error)
\tCountByCriteria(ctx context.Context, crit criteria.Criteria) (int, error)
}
`;
  }

  generatePostgresRepository(entityName, entityClass, serviceName, moduleName) {
    return `package repository

import (
\t"context"
\t"database/sql"
\t"fmt"
\t"log"
\t"${serviceName}/src/${moduleName}/domain/entity"
\t"${serviceName}/src/${moduleName}/domain/exception"
\t"pim/src/shared/domain/criteria"
\tsharedCriteria "pim/src/shared/infrastructure/criteria"
)

// ${entityClass}PostgresRepository implementa el repositorio usando PostgreSQL
type ${entityClass}PostgresRepository struct {
\tdb        *sql.DB
\tconverter *sharedCriteria.SQLCriteriaConverter
}

// New${entityClass}PostgresRepository crea una nueva instancia del repositorio
func New${entityClass}PostgresRepository(db *sql.DB) *${entityClass}PostgresRepository {
\treturn &${entityClass}PostgresRepository{
\t\tdb:        db,
\t\tconverter: sharedCriteria.NewSQLCriteriaConverter(),
\t}
}

// Create crea un nuevo ${entityName}
func (r *${entityClass}PostgresRepository) Create(ctx context.Context, ${entityName} *entity.${entityClass}) error {
\tquery := \`
\t\tINSERT INTO ${entityName}s (
\t\t\tid, tenant_id, name, active, created_at, updated_at
\t\t) VALUES (
\t\t\t$1, $2, $3, $4, $5, $6
\t\t)
\t\`

\t_, err := r.db.ExecContext(ctx, query,
\t\t${entityName}.ID,
\t\t${entityName}.TenantID,
\t\t${entityName}.Name,
\t\t${entityName}.Active,
\t\t${entityName}.CreatedAt,
\t\t${entityName}.UpdatedAt,
\t)

\tif err != nil {
\t\tlog.Printf("Error creando ${entityName}: %v", err)
\t\treturn fmt.Errorf("%w: %v", exception.Err${entityClass}CreateFailed, err)
\t}

\treturn nil
}

// Update actualiza un ${entityName} existente
func (r *${entityClass}PostgresRepository) Update(ctx context.Context, ${entityName} *entity.${entityClass}) error {
\tquery := \`
\t\tUPDATE ${entityName}s SET
\t\t\tname = $3,
\t\t\tactive = $4,
\t\t\tupdated_at = $5
\t\tWHERE id = $1 AND tenant_id = $2
\t\`

\tresult, err := r.db.ExecContext(ctx, query,
\t\t${entityName}.ID,
\t\t${entityName}.TenantID,
\t\t${entityName}.Name,
\t\t${entityName}.Active,
\t\t${entityName}.UpdatedAt,
\t)

\tif err != nil {
\t\tlog.Printf("Error actualizando ${entityName}: %v", err)
\t\treturn fmt.Errorf("%w: %v", exception.Err${entityClass}UpdateFailed, err)
\t}

\trowsAffected, _ := result.RowsAffected()
\tif rowsAffected == 0 {
\t\treturn exception.Err${entityClass}NotFound
\t}

\treturn nil
}

// FindByID busca un ${entityName} por su ID
func (r *${entityClass}PostgresRepository) FindByID(ctx context.Context, id string, tenantID string) (*entity.${entityClass}, error) {
\tquery := \`
\t\tSELECT id, tenant_id, name, active, created_at, updated_at
\t\tFROM ${entityName}s 
\t\tWHERE id = $1 AND tenant_id = $2
\t\`

\trow := r.db.QueryRowContext(ctx, query, id, tenantID)
\treturn r.scan${entityClass}(row)
}

// FindByTenant obtiene todos los ${entityName}s de un tenant
func (r *${entityClass}PostgresRepository) FindByTenant(ctx context.Context, tenantID string) ([]*entity.${entityClass}, error) {
\tquery := \`
\t\tSELECT id, tenant_id, name, active, created_at, updated_at
\t\tFROM ${entityName}s 
\t\tWHERE tenant_id = $1 AND active = true
\t\tORDER BY created_at DESC
\t\`

\trows, err := r.db.QueryContext(ctx, query, tenantID)
\tif err != nil {
\t\treturn nil, err
\t}
\tdefer rows.Close()

\treturn r.scan${entityClass}s(rows)
}

// Delete elimina un ${entityName}
func (r *${entityClass}PostgresRepository) Delete(ctx context.Context, id string, tenantID string) error {
\tquery := \`DELETE FROM ${entityName}s WHERE id = $1 AND tenant_id = $2\`

\tresult, err := r.db.ExecContext(ctx, query, id, tenantID)
\tif err != nil {
\t\tlog.Printf("Error eliminando ${entityName}: %v", err)
\t\treturn fmt.Errorf("%w: %v", exception.Err${entityClass}DeleteFailed, err)
\t}

\trowsAffected, _ := result.RowsAffected()
\tif rowsAffected == 0 {
\t\treturn exception.Err${entityClass}NotFound
\t}

\treturn nil
}

// SearchByCriteria busca ${entityName}s usando criterios
func (r *${entityClass}PostgresRepository) SearchByCriteria(ctx context.Context, crit criteria.Criteria) ([]*entity.${entityClass}, error) {
\tbaseQuery := \`
\t\tSELECT id, tenant_id, name, active, created_at, updated_at
\t\tFROM ${entityName}s
\t\`

\tquery, params := r.converter.ToSelectSQL(baseQuery, crit)

\trows, err := r.db.QueryContext(ctx, query, params...)
\tif err != nil {
\t\treturn nil, err
\t}
\tdefer rows.Close()

\treturn r.scan${entityClass}s(rows)
}

// CountByCriteria cuenta ${entityName}s usando criterios
func (r *${entityClass}PostgresRepository) CountByCriteria(ctx context.Context, crit criteria.Criteria) (int, error) {
\tbaseCountQuery := "SELECT COUNT(*) FROM ${entityName}s"

\tquery, params := r.converter.ToCountSQL(baseCountQuery, crit)

\tvar count int
\terr := r.db.QueryRowContext(ctx, query, params...).Scan(&count)
\treturn count, err
}

// scan${entityClass} escanea una fila y devuelve un ${entityName}
func (r *${entityClass}PostgresRepository) scan${entityClass}(row *sql.Row) (*entity.${entityClass}, error) {
\tvar ${entityName} entity.${entityClass}

\terr := row.Scan(
\t\t&${entityName}.ID,
\t\t&${entityName}.TenantID,
\t\t&${entityName}.Name,
\t\t&${entityName}.Active,
\t\t&${entityName}.CreatedAt,
\t\t&${entityName}.UpdatedAt,
\t)

\tif err == sql.ErrNoRows {
\t\treturn nil, nil
\t}
\tif err != nil {
\t\treturn nil, err
\t}

\treturn &${entityName}, nil
}

// scan${entityClass}s escanea múltiples filas y devuelve una lista de ${entityName}s
func (r *${entityClass}PostgresRepository) scan${entityClass}s(rows *sql.Rows) ([]*entity.${entityClass}, error) {
\tvar ${entityName}s []*entity.${entityClass}

\tfor rows.Next() {
\t\tvar ${entityName} entity.${entityClass}

\t\terr := rows.Scan(
\t\t\t&${entityName}.ID,
\t\t\t&${entityName}.TenantID,
\t\t\t&${entityName}.Name,
\t\t\t&${entityName}.Active,
\t\t\t&${entityName}.CreatedAt,
\t\t\t&${entityName}.UpdatedAt,
\t\t)

\t\tif err != nil {
\t\t\treturn nil, err
\t\t}

\t\t${entityName}s = append(${entityName}s, &${entityName})
\t}

\treturn ${entityName}s, nil
}
`;
  }

  generateExceptionFile(entityName) {
    const entityClass = entityName.replace(/_/g, '').replace(/^\w/, c => c.toUpperCase());
    return `package exception

import "errors"

// Errores de validación
var (
\tErr${entityClass}InvalidName = errors.New("nombre de ${entityName} inválido")
\tErr${entityClass}NameRequired = errors.New("nombre de ${entityName} es requerido")
)

// Errores de negocio
var (
\tErr${entityClass}NotFound = errors.New("${entityName} no encontrado")
\tErr${entityClass}AlreadyExists = errors.New("${entityName} ya existe")
)

// Errores de persistencia
var (
\tErr${entityClass}CreateFailed = errors.New("error al crear ${entityName}")
\tErr${entityClass}UpdateFailed = errors.New("error al actualizar ${entityName}")
\tErr${entityClass}DeleteFailed = errors.New("error al eliminar ${entityName}")
)
`;
  }

  generateControllerFile(entityName, serviceName, moduleName) {
    const entityClass = entityName.replace(/_/g, '').replace(/^\w/, c => c.toUpperCase());
    return `package controller

import (
\t"net/http"

\t"github.com/gin-gonic/gin"
\t"${serviceName}/src/${moduleName}/application/usecase"
\t"pim/src/shared/domain/criteria"
\tsharedCriteria "pim/src/shared/infrastructure/criteria"
)

// ${entityClass}Handler maneja las peticiones HTTP para ${entityName}s
type ${entityClass}Handler struct {
\t// TODO: Agregar casos de uso cuando estén implementados
\tcriteriaHelper *sharedCriteria.EntityCriteriaHelper
}

// New${entityClass}Handler crea una nueva instancia del manejador
func New${entityClass}Handler() *${entityClass}Handler {
\treturn &${entityClass}Handler{
\t\tcriteriaHelper: sharedCriteria.NewEntityCriteriaHelper(),
\t}
}

// RegisterRoutes registra las rutas del API
func (h *${entityClass}Handler) RegisterRoutes(router *gin.RouterGroup) {
\t${entityName}s := router.Group("/${entityName}s")
\t{
\t\t${entityName}s.POST("", h.Create)
\t\t${entityName}s.GET("", h.List)
\t\t${entityName}s.GET("/:id", h.GetByID)
\t\t${entityName}s.PUT("/:id", h.Update)
\t\t${entityName}s.DELETE("/:id", h.Delete)
\t}
}

// Create maneja la solicitud para crear un nuevo ${entityName}
func (h *${entityClass}Handler) Create(c *gin.Context) {
\t// Obtener el tenantID del header
\ttenantID := c.GetHeader("X-Tenant-ID")
\tif tenantID == "" {
\t\tc.JSON(http.StatusBadRequest, gin.H{"error": "el header X-Tenant-ID es obligatorio"})
\t\treturn
\t}

\t// TODO: Implementar binding de request y llamada al use case
\tc.JSON(http.StatusNotImplemented, gin.H{"error": "no implementado - falta implementar casos de uso"})
}

// List maneja la solicitud para listar ${entityName}s
func (h *${entityClass}Handler) List(c *gin.Context) {
\t// Obtener el tenantID del header
\ttenantID := c.GetHeader("X-Tenant-ID")
\tif tenantID == "" {
\t\tc.JSON(http.StatusBadRequest, gin.H{"error": "el header X-Tenant-ID es obligatorio"})
\t\treturn
\t}

\t// TODO: Implementar listado con criterios
\tc.JSON(http.StatusNotImplemented, gin.H{"error": "no implementado - falta implementar casos de uso"})
}

// GetByID maneja la solicitud para obtener un ${entityName} por ID
func (h *${entityClass}Handler) GetByID(c *gin.Context) {
\t// Obtener el tenantID del header
\ttenantID := c.GetHeader("X-Tenant-ID")
\tif tenantID == "" {
\t\tc.JSON(http.StatusBadRequest, gin.H{"error": "el header X-Tenant-ID es obligatorio"})
\t\treturn
\t}

\tid := c.Param("id")
\t// TODO: Implementar obtención por ID
\tc.JSON(http.StatusNotImplemented, gin.H{"error": "no implementado - falta implementar casos de uso"})
}

// Update maneja la solicitud para actualizar un ${entityName}
func (h *${entityClass}Handler) Update(c *gin.Context) {
\t// Obtener el tenantID del header
\ttenantID := c.GetHeader("X-Tenant-ID")
\tif tenantID == "" {
\t\tc.JSON(http.StatusBadRequest, gin.H{"error": "el header X-Tenant-ID es obligatorio"})
\t\treturn
\t}

\tid := c.Param("id")
\t// TODO: Implementar actualización
\tc.JSON(http.StatusNotImplemented, gin.H{"error": "no implementado - falta implementar casos de uso"})
}

// Delete maneja la solicitud para eliminar un ${entityName}
func (h *${entityClass}Handler) Delete(c *gin.Context) {
\t// Obtener el tenantID del header
\ttenantID := c.GetHeader("X-Tenant-ID")
\tif tenantID == "" {
\t\tc.JSON(http.StatusBadRequest, gin.H{"error": "el header X-Tenant-ID es obligatorio"})
\t\treturn
\t}

\tid := c.Param("id")
\t// TODO: Implementar eliminación
\tc.JSON(http.StatusNotImplemented, gin.H{"error": "no implementado - falta implementar casos de uso"})
}
`;
  }

  async createGoService(args) {
    // TODO: Implementar creación de servicios completos
    return {
      content: [
        {
          type: 'text',
          text: '🚧 Función create_go_service en desarrollo. Usa add_module_to_service por ahora.',
        },
      ],
    };
  }

  async showProjectStatus(args) {
    console.error('[MCP DEBUG] showProjectStatus called');
    try {
      console.error('[MCP DEBUG] Calling detectProjectRoot...');
      const projectRoot = this.detectProjectRoot();
      console.error('[MCP DEBUG] Project root returned:', projectRoot);
      logToFile(`[DEBUG] Project root returned: ${projectRoot}`);
      
      const servicesRoot = path.join(projectRoot, 'services');
      console.error('[MCP DEBUG] Services root:', servicesRoot);
      logToFile(`[DEBUG] Services root: ${servicesRoot}`);
      
      const services = fs.readdirSync(servicesRoot)
        .filter(item => fs.statSync(path.join(servicesRoot, item)).isDirectory())
        .map(service => {
          const servicePath = path.join(servicesRoot, service);
          let type = 'Desconocido';
          
          if (fs.existsSync(path.join(servicePath, 'go.mod'))) {
            type = 'Go';
          } else if (fs.existsSync(path.join(servicePath, 'package.json'))) {
            type = 'Node.js';
          }
          
          return `- ${service} (${type})`;
        });

      console.error('[MCP DEBUG] Services found:', services.length);
      
      return {
        content: [
          {
            type: 'text',
            text: `📊 Estado del Proyecto SaaS-MT:

📍 Raíz del proyecto: ${projectRoot}
📁 Directorio de servicios: ${servicesRoot}

🚀 Servicios encontrados:
${services.join('\n')}

✅ MCP Go Generator Node.js funcionando correctamente!

💡 Comandos disponibles:
- add_module_to_service: Agregar módulos a servicios existentes
- create_go_service: Crear nuevos servicios (en desarrollo)
- show_project_status: Mostrar este estado`,
          },
        ],
      };
    } catch (error) {
      console.error('[MCP DEBUG] Error in showProjectStatus:', error);
      throw new Error(`Error obteniendo estado del proyecto: ${error.message}`);
    }
  }

  async run() {
    logToFile('MCP Go Generator starting...');
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logToFile('MCP Go Generator connected');
    console.error('MCP Go Generator Node.js iniciado');
  }
}

const server = new GoGeneratorMCP();
server.run().catch(console.error);

// Export for testing
export { GoGeneratorMCP }; 