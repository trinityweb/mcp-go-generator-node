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
- show_project_status: Mostrar este estado
- analyze_usecase_workflow: Analizar casos de uso y generar roadmap
- generate_workflow_roadmap: Crear roadmap detallado para flujos
- generate_component_by_step: Generar componentes paso a paso
- generate_integration_scripts: Generar scripts de prueba
- update_project_tracking: Actualizar documentación de progreso`,
          },
        ],
      };
    } catch (error) {
      console.error('[MCP DEBUG] Error in showProjectStatus:', error);
      throw new Error(`Error obteniendo estado del proyecto: ${error.message}`);
    }
  }

  async analyzeUsecaseWorkflow(args) {
    const { service_path, module_name, usecase_description, business_rules = [], integration_points = [] } = args;
    
    try {
      const projectRoot = this.detectProjectRoot();
      const servicesRoot = path.join(projectRoot, 'services');
      const servicePath = path.join(servicesRoot, service_path);
      
      if (!fs.existsSync(servicePath)) {
        throw new Error(`El servicio ${service_path} no existe`);
      }

      const roadmap = {
        usecase: usecase_description,
        module: module_name,
        service: service_path,
        components_needed: [],
        implementation_steps: [],
        estimated_time: '',
      };

      // Analizar el caso de uso para determinar componentes necesarios
      const usecaseLower = usecase_description.toLowerCase();
      
      // Determinar operaciones CRUD necesarias
      const operations = [];
      if (usecaseLower.includes('crear') || usecaseLower.includes('create')) operations.push('create');
      if (usecaseLower.includes('actualizar') || usecaseLower.includes('update')) operations.push('update');
      if (usecaseLower.includes('eliminar') || usecaseLower.includes('delete')) operations.push('delete');
      if (usecaseLower.includes('buscar') || usecaseLower.includes('listar') || usecaseLower.includes('search')) operations.push('list');
      if (usecaseLower.includes('obtener') || usecaseLower.includes('get')) operations.push('get');
      
      if (operations.length === 0) operations.push('create', 'get', 'list'); // Por defecto

      // Identificar entidades mencionadas
      const entities = this.extractEntitiesFromDescription(usecase_description);

      // Componentes necesarios
      roadmap.components_needed = [
        ...entities.map(e => `Entity: ${e}`),
        ...entities.map(e => `Port: ${e}Repository`),
        ...entities.map(e => `Repository: ${e}PostgresRepository`),
        ...operations.map(op => `UseCase: ${op}${entities[0] || module_name}`),
        ...operations.map(op => `Request: ${op}${entities[0] || module_name}Request`),
        ...operations.map(op => `Response: ${op}${entities[0] || module_name}Response`),
        'Controller: HTTPHandler con endpoints REST',
        'Migrations: Tablas SQL para entidades',
      ];

      if (business_rules.length > 0) {
        roadmap.components_needed.push('Validators: Reglas de negocio específicas');
      }

      if (integration_points.length > 0) {
        roadmap.components_needed.push('Clients: Integraciones con otros servicios');
      }

      // Pasos de implementación
      roadmap.implementation_steps = [
        {
          step: 1,
          name: 'Crear estructura base del módulo',
          tasks: [
            'Ejecutar add_module_to_service para crear estructura',
            'Verificar directorios creados',
          ],
          estimated_time: '5 minutos',
        },
        {
          step: 2,
          name: 'Definir entidades de dominio',
          tasks: [
            'Crear entidades con campos necesarios',
            'Agregar métodos de negocio',
            'Implementar validaciones básicas',
          ],
          estimated_time: '15 minutos',
        },
        {
          step: 3,
          name: 'Implementar repositorios',
          tasks: [
            'Completar implementación de repositorios PostgreSQL',
            'Agregar queries específicas del negocio',
            'Implementar búsquedas con criteria',
          ],
          estimated_time: '30 minutos',
        },
        {
          step: 4,
          name: 'Crear casos de uso',
          tasks: operations.map(op => `Implementar ${op} use case`),
          estimated_time: '45 minutos',
        },
        {
          step: 5,
          name: 'Implementar DTOs',
          tasks: [
            'Crear request/response structures',
            'Agregar validaciones',
            'Implementar mappers',
          ],
          estimated_time: '20 minutos',
        },
        {
          step: 6,
          name: 'Completar controladores HTTP',
          tasks: [
            'Implementar endpoints REST',
            'Conectar con casos de uso',
            'Agregar manejo de errores',
          ],
          estimated_time: '20 minutos',
        },
        {
          step: 7,
          name: 'Crear migraciones',
          tasks: [
            'Definir estructura de tablas',
            'Agregar índices necesarios',
            'Crear scripts up/down',
          ],
          estimated_time: '15 minutos',
        },
        {
          step: 8,
          name: 'Integrar con el sistema',
          tasks: [
            'Registrar módulo en main.go',
            'Configurar wire para inyección',
            'Agregar rutas en Kong',
          ],
          estimated_time: '10 minutos',
        },
        {
          step: 9,
          name: 'Testing',
          tasks: [
            'Crear tests unitarios',
            'Implementar tests de integración',
            'Probar endpoints manualmente',
          ],
          estimated_time: '45 minutos',
        },
      ];

      // Calcular tiempo total
      const totalMinutes = roadmap.implementation_steps.reduce((acc, step) => {
        const minutes = parseInt(step.estimated_time.match(/\d+/)[0]);
        return acc + minutes;
      }, 0);
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      roadmap.estimated_time = hours > 0 ? `${hours}h ${minutes}min` : `${minutes} minutos`;

      return {
        content: [
          {
            type: 'text',
            text: `📋 Análisis del Caso de Uso: ${usecase_description}

🎯 Módulo: ${module_name} en ${service_path}

📦 Componentes Necesarios (${roadmap.components_needed.length}):
${roadmap.components_needed.map(c => `  - ${c}`).join('\n')}

📝 Plan de Implementación (${roadmap.implementation_steps.length} pasos):
${roadmap.implementation_steps.map(s => `
${s.step}. ${s.name} (⏱️ ${s.estimated_time})
${s.tasks.map(t => `   - ${t}`).join('\n')}`).join('\n')}

⏱️ Tiempo Total Estimado: ${roadmap.estimated_time}

${business_rules.length > 0 ? `
⚡ Reglas de Negocio a Implementar:
${business_rules.map(r => `  - ${r}`).join('\n')}` : ''}

${integration_points.length > 0 ? `
🔗 Puntos de Integración:
${integration_points.map(i => `  - ${i}`).join('\n')}` : ''}

💡 Próximo paso recomendado:
Ejecutar 'add_module_to_service' con las entidades identificadas: ${entities.join(', ') || module_name}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Error analizando caso de uso: ${error.message}`);
    }
  }

  extractEntitiesFromDescription(description) {
    // Extraer posibles nombres de entidades del texto
    const words = description.split(/\s+/);
    const entities = [];
    
    // Buscar palabras que parezcan entidades (sustantivos en singular)
    const entityPatterns = [
      /categoría|category/i,
      /producto|product/i,
      /usuario|user/i,
      /cliente|customer/i,
      /orden|order/i,
      /factura|invoice/i,
      /inventario|inventory/i,
      /stock/i,
      /atributo|attribute/i,
      /variante|variant/i,
    ];
    
    for (const pattern of entityPatterns) {
      if (pattern.test(description)) {
        const match = description.match(pattern)[0].toLowerCase();
        // Normalizar a inglés para consistencia en código
        const normalized = match
          .replace('categoría', 'category')
          .replace('producto', 'product')
          .replace('usuario', 'user')
          .replace('cliente', 'customer')
          .replace('orden', 'order')
          .replace('factura', 'invoice')
          .replace('inventario', 'inventory')
          .replace('atributo', 'attribute')
          .replace('variante', 'variant');
        
        if (!entities.includes(normalized)) {
          entities.push(normalized);
        }
      }
    }
    
    return entities;
  }

  async generateWorkflowRoadmap(args) {
    const { workflow_type, entity_name, operations = ['create', 'read', 'update', 'delete', 'list'], complexity_level = 'medium' } = args;
    
    const workflows = {
      crud_complete: {
        name: 'CRUD Completo',
        description: 'Implementación completa de Create, Read, Update, Delete y List',
        base_time: 120,
      },
      business_flow: {
        name: 'Flujo de Negocio',
        description: 'Implementación de un flujo de negocio específico con validaciones',
        base_time: 180,
      },
      integration_flow: {
        name: 'Flujo de Integración',
        description: 'Implementación de integración con servicios externos',
        base_time: 240,
      },
      custom: {
        name: 'Flujo Personalizado',
        description: 'Implementación personalizada según requerimientos',
        base_time: 150,
      },
    };

    const complexity_multiplier = {
      simple: 0.7,
      medium: 1.0,
      complex: 1.5,
    };

    const workflow = workflows[workflow_type];
    const time_multiplier = complexity_multiplier[complexity_level];
    const total_time = Math.round(workflow.base_time * time_multiplier);

    const roadmap = {
      workflow: workflow.name,
      entity: entity_name,
      operations: operations,
      complexity: complexity_level,
      phases: [],
    };

    // Fase 1: Preparación
    roadmap.phases.push({
      phase: 1,
      name: 'Preparación y Análisis',
      tasks: [
        {
          id: 'prep-1',
          name: 'Analizar requerimientos de negocio',
          description: `Definir comportamiento esperado para ${entity_name}`,
          estimated_time: '10 min',
          priority: 'high',
        },
        {
          id: 'prep-2',
          name: 'Diseñar estructura de datos',
          description: 'Definir campos, relaciones y constraints',
          estimated_time: '15 min',
          priority: 'high',
        },
        {
          id: 'prep-3',
          name: 'Identificar validaciones necesarias',
          description: 'Listar todas las reglas de negocio',
          estimated_time: '10 min',
          priority: 'medium',
        },
      ],
    });

    // Fase 2: Dominio
    roadmap.phases.push({
      phase: 2,
      name: 'Capa de Dominio',
      tasks: [
        {
          id: 'domain-1',
          name: `Crear entidad ${entity_name}`,
          description: 'Implementar entidad con campos y métodos de negocio',
          estimated_time: '20 min',
          priority: 'high',
        },
        {
          id: 'domain-2',
          name: 'Definir puerto del repositorio',
          description: 'Interface con métodos necesarios',
          estimated_time: '10 min',
          priority: 'high',
        },
        {
          id: 'domain-3',
          name: 'Crear excepciones de dominio',
          description: 'Errores específicos del negocio',
          estimated_time: '10 min',
          priority: 'medium',
        },
      ],
    });

    // Fase 3: Aplicación
    if (operations.length > 0) {
      const appTasks = [];
      
      for (const op of operations) {
        appTasks.push({
          id: `app-${op}`,
          name: `Implementar caso de uso ${op}`,
          description: `Lógica de negocio para ${op} ${entity_name}`,
          estimated_time: '15 min',
          priority: 'high',
        });
      }

      roadmap.phases.push({
        phase: 3,
        name: 'Capa de Aplicación',
        tasks: appTasks,
      });
    }

    // Fase 4: Infraestructura
    roadmap.phases.push({
      phase: 4,
      name: 'Capa de Infraestructura',
      tasks: [
        {
          id: 'infra-1',
          name: 'Implementar repositorio PostgreSQL',
          description: 'CRUD completo con queries SQL',
          estimated_time: '30 min',
          priority: 'high',
        },
        {
          id: 'infra-2',
          name: 'Crear controlador HTTP',
          description: 'Endpoints REST con validaciones',
          estimated_time: '25 min',
          priority: 'high',
        },
        {
          id: 'infra-3',
          name: 'Implementar DTOs',
          description: 'Request/Response con mappers',
          estimated_time: '20 min',
          priority: 'medium',
        },
      ],
    });

    // Fase 5: Integración
    roadmap.phases.push({
      phase: 5,
      name: 'Integración y Testing',
      tasks: [
        {
          id: 'test-1',
          name: 'Crear migraciones SQL',
          description: 'Scripts para crear tablas e índices',
          estimated_time: '15 min',
          priority: 'high',
        },
        {
          id: 'test-2',
          name: 'Escribir tests unitarios',
          description: 'Tests para casos de uso y entidades',
          estimated_time: '30 min',
          priority: 'medium',
        },
        {
          id: 'test-3',
          name: 'Configurar en main.go y wire',
          description: 'Registrar módulo en el sistema',
          estimated_time: '10 min',
          priority: 'high',
        },
        {
          id: 'test-4',
          name: 'Probar endpoints',
          description: 'Testing manual con curl/postman',
          estimated_time: '15 min',
          priority: 'medium',
        },
      ],
    });

    // Calcular checkpoints
    const checkpoints = [
      {
        after_phase: 2,
        name: 'Dominio Completo',
        validation: 'Entidad creada, repositorio definido, excepciones listas',
      },
      {
        after_phase: 3,
        name: 'Lógica de Negocio Lista',
        validation: 'Todos los casos de uso implementados y probados',
      },
      {
        after_phase: 5,
        name: 'Módulo Funcional',
        validation: 'Endpoints funcionando, datos persistiendo correctamente',
      },
    ];

    return {
      content: [
        {
          type: 'text',
          text: `🗺️ Roadmap de Implementación: ${workflow.name}

📦 Entidad: ${entity_name}
🔧 Operaciones: ${operations.join(', ')}
📊 Complejidad: ${complexity_level}
⏱️ Tiempo estimado total: ${total_time} minutos

${roadmap.phases.map(phase => `
### Fase ${phase.phase}: ${phase.name}
${phase.tasks.map(task => `
**[${task.id}] ${task.name}** (${task.estimated_time})
📝 ${task.description}
🎯 Prioridad: ${task.priority}`).join('\n')}
`).join('\n')}

## 🏁 Checkpoints de Validación:
${checkpoints.map(cp => `
✅ **${cp.name}** (después de fase ${cp.after_phase})
   ${cp.validation}`).join('\n')}

## 🚀 Comandos para Ejecutar:

1. **Iniciar estructura base:**
   \`\`\`
   add_module_to_service
   - service_path: "saas-mt-xxx-service"
   - module_name: "${entity_name.toLowerCase()}"
   - entities: ["${entity_name.toLowerCase()}"]
   \`\`\`

2. **Generar componentes paso a paso:**
   \`\`\`
   generate_component_by_step
   - component_type: "entity" / "usecase" / "repository" / etc.
   \`\`\`

3. **Generar scripts de prueba:**
   \`\`\`
   generate_integration_scripts
   \`\`\`

💡 Este roadmap es tu guía completa para implementar ${entity_name} de forma sistemática.`,
        },
      ],
    };
  }

  async generateComponentByStep(args) {
    const { service_path, module_name, component_type, entity_name, operation_name = '', dependencies = [], business_rules = [] } = args;
    
    try {
      const projectRoot = this.detectProjectRoot();
      const servicesRoot = path.join(projectRoot, 'services');
      const servicePath = path.join(servicesRoot, service_path);
      const modulePath = path.join(servicePath, 'src', module_name);
      
      if (!fs.existsSync(servicePath)) {
        throw new Error(`El servicio ${service_path} no existe`);
      }

      if (!fs.existsSync(modulePath)) {
        throw new Error(`El módulo ${module_name} no existe. Ejecuta primero add_module_to_service`);
      }

      // Extraer el nombre del servicio para imports
      let serviceName = path.basename(servicePath);
      if (serviceName.startsWith('saas-mt-') && serviceName.endsWith('-service')) {
        serviceName = serviceName.slice(8, -8);
      }

      const entityClass = entity_name.replace(/_/g, '').replace(/^\w/, c => c.toUpperCase());
      let content = '';
      let filePath = '';

      switch (component_type) {
        case 'entity':
          content = this.generateEntityFile(entity_name, entityClass);
          filePath = path.join(modulePath, 'domain', 'entity', `${entity_name}.go`);
          break;

        case 'port':
          content = this.generateRepositoryPort(entity_name, entityClass, serviceName, module_name);
          filePath = path.join(modulePath, 'domain', 'port', `${entity_name}_repository.go`);
          break;

        case 'usecase':
          if (!operation_name) {
            throw new Error('operation_name es requerido para generar un caso de uso');
          }
          content = this.generateUseCase(entity_name, entityClass, operation_name, serviceName, module_name, business_rules);
          filePath = path.join(modulePath, 'application', 'usecase', `${operation_name}_${entity_name}.go`);
          break;

        case 'request':
          if (!operation_name) {
            throw new Error('operation_name es requerido para generar un request');
          }
          content = this.generateRequest(entity_name, entityClass, operation_name);
          filePath = path.join(modulePath, 'application', 'request', `${operation_name}_${entity_name}_request.go`);
          break;

        case 'response':
          if (!operation_name) {
            throw new Error('operation_name es requerido para generar un response');
          }
          content = this.generateResponse(entity_name, entityClass, operation_name);
          filePath = path.join(modulePath, 'application', 'response', `${operation_name}_${entity_name}_response.go`);
          break;

        case 'repository':
          content = this.generatePostgresRepository(entity_name, entityClass, serviceName, module_name);
          filePath = path.join(modulePath, 'infrastructure', 'persistence', 'repository', `${entity_name}_postgres_repository.go`);
          break;

        case 'controller':
          content = this.generateControllerFile(entity_name, serviceName, module_name);
          filePath = path.join(modulePath, 'infrastructure', 'controller', 'http_handler.go');
          break;

        case 'criteria_builder':
          content = this.generateCriteriaBuilder(entity_name, entityClass);
          filePath = path.join(modulePath, 'domain', 'criteria', `${entity_name}_criteria.go`);
          break;

        case 'mapper':
          content = this.generateMapper(entity_name, entityClass, serviceName, module_name);
          filePath = path.join(modulePath, 'application', 'mapper', `${entity_name}_mapper.go`);
          break;

        case 'object_mother':
          content = this.generateObjectMother(entity_name, entityClass, serviceName, module_name);
          filePath = path.join(modulePath, 'test', 'mother', `${entity_name}_mother.go`);
          break;

        case 'integration_test':
          content = this.generateIntegrationTest(entity_name, entityClass, serviceName, module_name);
          filePath = path.join(modulePath, 'test', 'integration', `${entity_name}_test.go`);
          break;

        default:
          throw new Error(`Tipo de componente no soportado: ${component_type}`);
      }

      // Crear directorio si no existe
      await fs.ensureDir(path.dirname(filePath));
      
      // Escribir archivo
      await fs.writeFile(filePath, content);

      return {
        content: [
          {
            type: 'text',
            text: `✅ Componente generado exitosamente!

📦 Tipo: ${component_type}
📁 Archivo: ${filePath}
🎯 Entidad: ${entity_name}
${operation_name ? `🔧 Operación: ${operation_name}` : ''}

${business_rules.length > 0 ? `
⚡ Reglas de negocio aplicadas:
${business_rules.map(r => `  - ${r}`).join('\n')}` : ''}

${dependencies.length > 0 ? `
🔗 Dependencias incluidas:
${dependencies.map(d => `  - ${d}`).join('\n')}` : ''}

💡 Próximo paso sugerido:
${this.suggestNextComponent(component_type, operation_name)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Error generando componente: ${error.message}`);
    }
  }

  suggestNextComponent(currentComponent, operation) {
    const suggestions = {
      'entity': 'Generar el puerto del repositorio (component_type: "port")',
      'port': 'Implementar el repositorio PostgreSQL (component_type: "repository")',
      'repository': 'Crear los casos de uso (component_type: "usecase")',
      'usecase': 'Generar los DTOs request/response (component_type: "request" y "response")',
      'request': 'Generar el response correspondiente (component_type: "response")',
      'response': 'Implementar el mapper (component_type: "mapper")',
      'mapper': 'Actualizar el controlador HTTP (component_type: "controller")',
      'controller': 'Crear tests de integración (component_type: "integration_test")',
      'integration_test': 'Generar scripts de prueba con generate_integration_scripts',
    };
    
    return suggestions[currentComponent] || 'Revisar el roadmap completo';
  }

  generateUseCase(entityName, entityClass, operation, serviceName, moduleName, businessRules) {
    const opClass = operation.charAt(0).toUpperCase() + operation.slice(1);
    
    return `package usecase

import (
\t"context"
\t"fmt"
\t"${serviceName}/src/${moduleName}/domain/entity"
\t"${serviceName}/src/${moduleName}/domain/exception"
\t"${serviceName}/src/${moduleName}/domain/port"
)

// ${opClass}${entityClass} implementa el caso de uso para ${operation} ${entityName}
type ${opClass}${entityClass} struct {
\trepository port.${entityClass}Repository
}

// New${opClass}${entityClass} crea una nueva instancia del caso de uso
func New${opClass}${entityClass}(repository port.${entityClass}Repository) *${opClass}${entityClass} {
\treturn &${opClass}${entityClass}{
\t\trepository: repository,
\t}
}

// Execute ejecuta el caso de uso
func (uc *${opClass}${entityClass}) Execute(ctx context.Context, ${this.getUseCaseParams(operation, entityName)}) ${this.getUseCaseReturn(operation, entityClass)} {
${this.getUseCaseBody(operation, entityName, entityClass, businessRules)}
}

${this.getUseCaseHelpers(operation, entityName, entityClass, businessRules)}`;
  }

  getUseCaseParams(operation, entityName) {
    switch (operation) {
      case 'create':
        return `tenantID, name string`;
      case 'update':
        return `id, tenantID string, name string, active bool`;
      case 'delete':
        return `id, tenantID string`;
      case 'get':
        return `id, tenantID string`;
      case 'list':
        return `tenantID string, page, pageSize int`;
      default:
        return `tenantID string`;
    }
  }

  getUseCaseReturn(operation, entityClass) {
    switch (operation) {
      case 'create':
      case 'update':
      case 'get':
        return `(*entity.${entityClass}, error)`;
      case 'delete':
        return `error`;
      case 'list':
        return `([]*entity.${entityClass}, int, error)`;
      default:
        return `error`;
    }
  }

  getUseCaseBody(operation, entityName, entityClass, businessRules) {
    switch (operation) {
      case 'create':
        return `\t// Validaciones de negocio
\tif err := uc.validate${entityClass}(name); err != nil {
\t\treturn nil, err
\t}
${businessRules.length > 0 ? `
\t// Reglas de negocio específicas
${businessRules.map(rule => `\t// TODO: Implementar: ${rule}`).join('\n')}
` : ''}
\t// Crear entidad
\t${entityName}, err := entity.New${entityClass}(tenantID, name)
\tif err != nil {
\t\treturn nil, err
\t}

\t// Persistir
\tif err := uc.repository.Create(ctx, ${entityName}); err != nil {
\t\treturn nil, err
\t}

\treturn ${entityName}, nil`;

      case 'update':
        return `\t// Buscar entidad existente
\t${entityName}, err := uc.repository.FindByID(ctx, id, tenantID)
\tif err != nil {
\t\treturn nil, err
\t}
\tif ${entityName} == nil {
\t\treturn nil, exception.Err${entityClass}NotFound
\t}

\t// Validaciones
\tif err := uc.validate${entityClass}(name); err != nil {
\t\treturn nil, err
\t}

\t// Actualizar campos
\t${entityName}.Name = name
\t${entityName}.Active = active
\t${entityName}.Update()

\t// Persistir cambios
\tif err := uc.repository.Update(ctx, ${entityName}); err != nil {
\t\treturn nil, err
\t}

\treturn ${entityName}, nil`;

      case 'delete':
        return `\t// Verificar que existe
\t${entityName}, err := uc.repository.FindByID(ctx, id, tenantID)
\tif err != nil {
\t\treturn err
\t}
\tif ${entityName} == nil {
\t\treturn exception.Err${entityClass}NotFound
\t}

\t// Eliminar
\treturn uc.repository.Delete(ctx, id, tenantID)`;

      case 'get':
        return `\t${entityName}, err := uc.repository.FindByID(ctx, id, tenantID)
\tif err != nil {
\t\treturn nil, err
\t}
\tif ${entityName} == nil {
\t\treturn nil, exception.Err${entityClass}NotFound
\t}
\treturn ${entityName}, nil`;

      case 'list':
        return `\t// TODO: Implementar paginación y filtros con criteria
\titems, err := uc.repository.FindByTenant(ctx, tenantID)
\tif err != nil {
\t\treturn nil, 0, err
\t}
\treturn items, len(items), nil`;

      default:
        return `\t// TODO: Implementar lógica del caso de uso
\treturn fmt.Errorf("no implementado")`;
    }
  }

  getUseCaseHelpers(operation, entityName, entityClass, businessRules) {
    if (operation === 'create' || operation === 'update') {
      return `
// validate${entityClass} valida los datos de entrada
func (uc *${operation === 'create' ? 'Create' : 'Update'}${entityClass}) validate${entityClass}(name string) error {
\tif name == "" {
\t\treturn exception.Err${entityClass}NameRequired
\t}
\tif len(name) < 3 || len(name) > 100 {
\t\treturn exception.Err${entityClass}InvalidName
\t}
\treturn nil
}`;
    }
    return '';
  }

  generateRequest(entityName, entityClass, operation) {
    const opClass = operation.charAt(0).toUpperCase() + operation.slice(1);
    
    const fields = this.getRequestFields(operation);
    
    return `package request

// ${opClass}${entityClass}Request representa la petición para ${operation} ${entityName}
type ${opClass}${entityClass}Request struct {
${fields.map(f => `\t${f.name} ${f.type} \`json:"${f.json}"${f.binding ? ` binding:"${f.binding}"` : ''}\``).join('\n')}
}`;
  }

  getRequestFields(operation) {
    switch (operation) {
      case 'create':
        return [
          { name: 'Name', type: 'string', json: 'name', binding: 'required,min=3,max=100' },
        ];
      case 'update':
        return [
          { name: 'Name', type: 'string', json: 'name', binding: 'required,min=3,max=100' },
          { name: 'Active', type: 'bool', json: 'active' },
        ];
      case 'list':
        return [
          { name: 'Page', type: 'int', json: 'page', binding: 'min=1' },
          { name: 'PageSize', type: 'int', json: 'page_size', binding: 'min=1,max=100' },
          { name: 'SortBy', type: 'string', json: 'sort_by' },
          { name: 'SortDir', type: 'string', json: 'sort_dir', binding: 'omitempty,oneof=asc desc' },
        ];
      default:
        return [];
    }
  }

  generateResponse(entityName, entityClass, operation) {
    const opClass = operation.charAt(0).toUpperCase() + operation.slice(1);
    
    if (operation === 'list') {
      return `package response

import "time"

// ${entityClass}Response representa la respuesta de un ${entityName}
type ${entityClass}Response struct {
\tID        string    \`json:"id"\`
\tTenantID  string    \`json:"tenant_id"\`
\tName      string    \`json:"name"\`
\tActive    bool      \`json:"active"\`
\tCreatedAt time.Time \`json:"created_at"\`
\tUpdatedAt time.Time \`json:"updated_at"\`
}

// ${opClass}${entityClass}Response representa la respuesta paginada
type ${opClass}${entityClass}Response struct {
\tItems      []*${entityClass}Response \`json:"items"\`
\tTotalCount int                       \`json:"total_count"\`
\tPage       int                       \`json:"page"\`
\tPageSize   int                       \`json:"page_size"\`
\tTotalPages int                       \`json:"total_pages"\`
}`;
    }
    
    return `package response

import "time"

// ${opClass}${entityClass}Response representa la respuesta para ${operation} ${entityName}
type ${opClass}${entityClass}Response struct {
\tID        string    \`json:"id"\`
\tTenantID  string    \`json:"tenant_id"\`
\tName      string    \`json:"name"\`
\tActive    bool      \`json:"active"\`
\tCreatedAt time.Time \`json:"created_at"\`
\tUpdatedAt time.Time \`json:"updated_at"\`
}`;
  }

  generateCriteriaBuilder(entityName, entityClass) {
    return `package criteria

import "pim/src/shared/domain/criteria"

// ${entityClass}CriteriaBuilder ayuda a construir criterios para ${entityName}
type ${entityClass}CriteriaBuilder struct {
\tfilters []criteria.Filter
\torders  []criteria.Order
\tlimit   *int
\toffset  *int
}

// New${entityClass}CriteriaBuilder crea un nuevo builder
func New${entityClass}CriteriaBuilder() *${entityClass}CriteriaBuilder {
\treturn &${entityClass}CriteriaBuilder{
\t\tfilters: []criteria.Filter{},
\t\torders:  []criteria.Order{},
\t}
}

// WithTenantID agrega filtro por tenant
func (b *${entityClass}CriteriaBuilder) WithTenantID(tenantID string) *${entityClass}CriteriaBuilder {
\tb.filters = append(b.filters, criteria.NewFilter("tenant_id", criteria.EQUALS, tenantID))
\treturn b
}

// WithName agrega filtro por nombre
func (b *${entityClass}CriteriaBuilder) WithName(name string) *${entityClass}CriteriaBuilder {
\tb.filters = append(b.filters, criteria.NewFilter("name", criteria.CONTAINS, name))
\treturn b
}

// WithActive agrega filtro por estado activo
func (b *${entityClass}CriteriaBuilder) WithActive(active bool) *${entityClass}CriteriaBuilder {
\tb.filters = append(b.filters, criteria.NewFilter("active", criteria.EQUALS, active))
\treturn b
}

// OrderByCreatedAt ordena por fecha de creación
func (b *${entityClass}CriteriaBuilder) OrderByCreatedAt(desc bool) *${entityClass}CriteriaBuilder {
\torderType := criteria.ASC
\tif desc {
\t\torderType = criteria.DESC
\t}
\tb.orders = append(b.orders, criteria.NewOrder("created_at", orderType))
\treturn b
}

// WithPagination agrega paginación
func (b *${entityClass}CriteriaBuilder) WithPagination(page, pageSize int) *${entityClass}CriteriaBuilder {
\toffset := (page - 1) * pageSize
\tb.limit = &pageSize
\tb.offset = &offset
\treturn b
}

// Build construye el criteria final
func (b *${entityClass}CriteriaBuilder) Build() criteria.Criteria {
\treturn criteria.NewCriteria(b.filters, b.orders, b.limit, b.offset)
}`;
  }

  generateMapper(entityName, entityClass, serviceName, moduleName) {
    return `package mapper

import (
\t"${serviceName}/src/${moduleName}/application/response"
\t"${serviceName}/src/${moduleName}/domain/entity"
)

// ${entityClass}Mapper mapea entre entidades y DTOs
type ${entityClass}Mapper struct{}

// New${entityClass}Mapper crea una nueva instancia del mapper
func New${entityClass}Mapper() *${entityClass}Mapper {
\treturn &${entityClass}Mapper{}
}

// ToResponse convierte una entidad a response DTO
func (m *${entityClass}Mapper) ToResponse(${entityName} *entity.${entityClass}) *response.${entityClass}Response {
\tif ${entityName} == nil {
\t\treturn nil
\t}
\t
\treturn &response.${entityClass}Response{
\t\tID:        ${entityName}.ID,
\t\tTenantID:  ${entityName}.TenantID,
\t\tName:      ${entityName}.Name,
\t\tActive:    ${entityName}.Active,
\t\tCreatedAt: ${entityName}.CreatedAt,
\t\tUpdatedAt: ${entityName}.UpdatedAt,
\t}
}

// ToResponseList convierte una lista de entidades a response DTOs
func (m *${entityClass}Mapper) ToResponseList(items []*entity.${entityClass}) []*response.${entityClass}Response {
\tresponses := make([]*response.${entityClass}Response, 0, len(items))
\tfor _, item := range items {
\t\tresponses = append(responses, m.ToResponse(item))
\t}
\treturn responses
}

// ToListResponse convierte a respuesta paginada
func (m *${entityClass}Mapper) ToListResponse(items []*entity.${entityClass}, totalCount, page, pageSize int) *response.List${entityClass}Response {
\ttotalPages := (totalCount + pageSize - 1) / pageSize
\t
\treturn &response.List${entityClass}Response{
\t\tItems:      m.ToResponseList(items),
\t\tTotalCount: totalCount,
\t\tPage:       page,
\t\tPageSize:   pageSize,
\t\tTotalPages: totalPages,
\t}
}`;
  }

  generateObjectMother(entityName, entityClass, serviceName, moduleName) {
    return `package mother

import (
\t"fmt"
\t"time"
\t"github.com/google/uuid"
\t"${serviceName}/src/${moduleName}/domain/entity"
)

// ${entityClass}Mother ayuda a crear objetos para testing
type ${entityClass}Mother struct{}

// New${entityClass}Mother crea una nueva instancia
func New${entityClass}Mother() *${entityClass}Mother {
\treturn &${entityClass}Mother{}
}

// Create crea un ${entityName} básico para tests
func (m *${entityClass}Mother) Create() *entity.${entityClass} {
\treturn &entity.${entityClass}{
\t\tID:        uuid.New().String(),
\t\tTenantID:  "test-tenant-id",
\t\tName:      "Test ${entityClass}",
\t\tActive:    true,
\t\tCreatedAt: time.Now(),
\t\tUpdatedAt: time.Now(),
\t}
}

// CreateWithName crea un ${entityName} con nombre específico
func (m *${entityClass}Mother) CreateWithName(name string) *entity.${entityClass} {
\t${entityName} := m.Create()
\t${entityName}.Name = name
\treturn ${entityName}
}

// CreateWithTenant crea un ${entityName} para un tenant específico
func (m *${entityClass}Mother) CreateWithTenant(tenantID string) *entity.${entityClass} {
\t${entityName} := m.Create()
\t${entityName}.TenantID = tenantID
\treturn ${entityName}
}

// CreateInactive crea un ${entityName} inactivo
func (m *${entityClass}Mother) CreateInactive() *entity.${entityClass} {
\t${entityName} := m.Create()
\t${entityName}.Active = false
\treturn ${entityName}
}

// CreateList crea una lista de ${entityName}s para tests
func (m *${entityClass}Mother) CreateList(count int, tenantID string) []*entity.${entityClass} {
\titems := make([]*entity.${entityClass}, count)
\tfor i := 0; i < count; i++ {
\t\t${entityName} := m.Create()
\t\t${entityName}.TenantID = tenantID
\t\t${entityName}.Name = fmt.Sprintf("Test ${entityClass} %d", i+1)
\t\titems[i] = ${entityName}
\t}
\treturn items
}`;
  }

  generateIntegrationTest(entityName, entityClass, serviceName, moduleName) {
    return `package integration_test

import (
\t"context"
\t"testing"
\t"${serviceName}/src/${moduleName}/domain/entity"
\t"${serviceName}/src/${moduleName}/infrastructure/persistence/repository"
\t"${serviceName}/src/${moduleName}/test/mother"
\t"github.com/stretchr/testify/assert"
\t"github.com/stretchr/testify/require"
)

func Test${entityClass}Repository_CRUD(t *testing.T) {
\t// Setup
\tdb := setupTestDB(t)
\tdefer db.Close()
\t
\trepo := repository.New${entityClass}PostgresRepository(db)
\tmother := mother.New${entityClass}Mother()
\tctx := context.Background()
\t
\tt.Run("Create and FindByID", func(t *testing.T) {
\t\t// Given
\t\t${entityName} := mother.Create()
\t\t
\t\t// When
\t\terr := repo.Create(ctx, ${entityName})
\t\t
\t\t// Then
\t\trequire.NoError(t, err)
\t\t
\t\t// When
\t\tfound, err := repo.FindByID(ctx, ${entityName}.ID, ${entityName}.TenantID)
\t\t
\t\t// Then
\t\trequire.NoError(t, err)
\t\tassert.Equal(t, ${entityName}.ID, found.ID)
\t\tassert.Equal(t, ${entityName}.Name, found.Name)
\t})
\t
\tt.Run("Update", func(t *testing.T) {
\t\t// Given
\t\t${entityName} := mother.Create()
\t\trequire.NoError(t, repo.Create(ctx, ${entityName}))
\t\t
\t\t// When
\t\t${entityName}.Name = "Updated Name"
\t\t${entityName}.Update()
\t\terr := repo.Update(ctx, ${entityName})
\t\t
\t\t// Then
\t\trequire.NoError(t, err)
\t\t
\t\t// Verify
\t\tupdated, err := repo.FindByID(ctx, ${entityName}.ID, ${entityName}.TenantID)
\t\trequire.NoError(t, err)
\t\tassert.Equal(t, "Updated Name", updated.Name)
\t})
\t
\tt.Run("Delete", func(t *testing.T) {
\t\t// Given
\t\t${entityName} := mother.Create()
\t\trequire.NoError(t, repo.Create(ctx, ${entityName}))
\t\t
\t\t// When
\t\terr := repo.Delete(ctx, ${entityName}.ID, ${entityName}.TenantID)
\t\t
\t\t// Then
\t\trequire.NoError(t, err)
\t\t
\t\t// Verify
\t\tfound, err := repo.FindByID(ctx, ${entityName}.ID, ${entityName}.TenantID)
\t\trequire.NoError(t, err)
\t\tassert.Nil(t, found)
\t})
\t
\tt.Run("FindByTenant", func(t *testing.T) {
\t\t// Given
\t\ttenantID := "test-tenant-" + t.Name()
\t\titems := mother.CreateList(5, tenantID)
\t\t
\t\tfor _, item := range items {
\t\t\trequire.NoError(t, repo.Create(ctx, item))
\t\t}
\t\t
\t\t// When
\t\tfound, err := repo.FindByTenant(ctx, tenantID)
\t\t
\t\t// Then
\t\trequire.NoError(t, err)
\t\tassert.Len(t, found, 5)
\t})
}

// setupTestDB configura la base de datos para tests
func setupTestDB(t *testing.T) *sql.DB {
\t// TODO: Implementar conexión a base de datos de test
\t// Por ejemplo, usando testcontainers o una BD en memoria
\tpanic("setupTestDB no implementado")
}`;
  }

  async generateIntegrationScripts(args) {
    const { service_path, module_name, entity_name, endpoints = [], test_scenarios = ['happy_path', 'validation_errors', 'not_found', 'unauthorized'] } = args;
    
    try {
      const projectRoot = this.detectProjectRoot();
      const servicesRoot = path.join(projectRoot, 'services');
      const servicePath = path.join(servicesRoot, service_path);
      
      if (!fs.existsSync(servicePath)) {
        throw new Error(`El servicio ${service_path} no existe`);
      }

      // Determinar puerto del servicio
      let servicePort = '8080'; // Default
      if (service_path.includes('pim')) servicePort = '8090';
      else if (service_path.includes('stock')) servicePort = '8100';
      else if (service_path.includes('chat')) servicePort = '8000';

      // Endpoints por defecto si no se especifican
      const defaultEndpoints = [
        { method: 'POST', path: `/${entity_name}s`, description: `Crear ${entity_name}` },
        { method: 'GET', path: `/${entity_name}s`, description: `Listar ${entity_name}s` },
        { method: 'GET', path: `/${entity_name}s/:id`, description: `Obtener ${entity_name} por ID` },
        { method: 'PUT', path: `/${entity_name}s/:id`, description: `Actualizar ${entity_name}` },
        { method: 'DELETE', path: `/${entity_name}s/:id`, description: `Eliminar ${entity_name}` },
      ];

      const finalEndpoints = endpoints.length > 0 ? endpoints : defaultEndpoints;

      // Generar scripts curl
      const curlScripts = this.generateCurlScripts(entity_name, servicePort, finalEndpoints, test_scenarios);
      
      // Generar colección Postman
      const postmanCollection = this.generatePostmanCollection(service_path, module_name, entity_name, servicePort, finalEndpoints);

      // Crear directorio de scripts
      const scriptsPath = path.join(servicePath, 'scripts', 'integration', module_name);
      await fs.ensureDir(scriptsPath);

      // Guardar scripts
      await fs.writeFile(path.join(scriptsPath, `${entity_name}_curl.sh`), curlScripts);
      await fs.writeFile(path.join(scriptsPath, `${entity_name}_postman.json`), JSON.stringify(postmanCollection, null, 2));

      return {
        content: [
          {
            type: 'text',
            text: `🚀 Scripts de integración generados exitosamente!

📁 Ubicación: ${scriptsPath}

📋 Archivos generados:
- ${entity_name}_curl.sh - Scripts curl para testing manual
- ${entity_name}_postman.json - Colección Postman importable

🔧 Endpoints configurados:
${finalEndpoints.map(ep => `- ${ep.method} ${ep.path} - ${ep.description}`).join('\n')}

📝 Escenarios de prueba incluidos:
${test_scenarios.map(s => `- ${s}`).join('\n')}

💡 Uso de los scripts:

**Curl:**
\`\`\`bash
chmod +x ${scriptsPath}/${entity_name}_curl.sh
./${entity_name}_curl.sh
\`\`\`

**Postman:**
1. Abrir Postman
2. Import → Upload Files
3. Seleccionar ${entity_name}_postman.json
4. Configurar variables de entorno:
   - base_url: http://localhost:${servicePort}
   - jwt_token: [tu token JWT]
   - tenant_id: [tu tenant ID]

⚠️ Recuerda:
- Los scripts requieren un token JWT válido
- Debes tener el servicio ejecutándose en el puerto ${servicePort}
- Ajusta los IDs de ejemplo según tus datos`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Error generando scripts de integración: ${error.message}`);
    }
  }

  generateCurlScripts(entityName, port, endpoints, scenarios) {
    const entityClass = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    
    return `#!/bin/bash

# Scripts de prueba para ${entityClass} API
# Puerto del servicio: ${port}

# Variables de configuración
BASE_URL="http://localhost:${port}"
JWT_TOKEN="tu-jwt-token-aqui"
TENANT_ID="test-tenant-id"

# Colores para output
GREEN='\\033[0;32m'
RED='\\033[0;31m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Función para imprimir headers
print_test() {
    echo -e "\\n${BLUE}=== $1 ===${NC}\\n"
}

# Función para verificar respuesta
check_response() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ Success${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
    fi
}

${scenarios.includes('happy_path') ? `
# Happy Path Tests
print_test "HAPPY PATH: Crear ${entityName}"
RESPONSE=$(curl -s -X POST \\
    -H "Authorization: Bearer $JWT_TOKEN" \\
    -H "X-Tenant-ID: $TENANT_ID" \\
    -H "Content-Type: application/json" \\
    -d '{
        "name": "Test ${entityClass}"
    }' \\
    $BASE_URL/${entityName}s)

echo "Response: $RESPONSE"
ENTITY_ID=$(echo $RESPONSE | jq -r '.id')
echo "Created ID: $ENTITY_ID"

print_test "HAPPY PATH: Obtener ${entityName} por ID"
curl -s -X GET \\
    -H "Authorization: Bearer $JWT_TOKEN" \\
    -H "X-Tenant-ID: $TENANT_ID" \\
    $BASE_URL/${entityName}s/$ENTITY_ID | jq '.'

print_test "HAPPY PATH: Listar ${entityName}s"
curl -s -X GET \\
    -H "Authorization: Bearer $JWT_TOKEN" \\
    -H "X-Tenant-ID: $TENANT_ID" \\
    "$BASE_URL/${entityName}s?page=1&page_size=10" | jq '.'

print_test "HAPPY PATH: Actualizar ${entityName}"
curl -s -X PUT \\
    -H "Authorization: Bearer $JWT_TOKEN" \\
    -H "X-Tenant-ID: $TENANT_ID" \\
    -H "Content-Type: application/json" \\
    -d '{
        "name": "Updated ${entityClass}",
        "active": true
    }' \\
    $BASE_URL/${entityName}s/$ENTITY_ID | jq '.'

print_test "HAPPY PATH: Eliminar ${entityName}"
curl -s -X DELETE \\
    -H "Authorization: Bearer $JWT_TOKEN" \\
    -H "X-Tenant-ID: $TENANT_ID" \\
    $BASE_URL/${entityName}s/$ENTITY_ID
check_response $?
` : ''}

${scenarios.includes('validation_errors') ? `
# Validation Error Tests
print_test "VALIDATION: Crear sin nombre"
curl -s -X POST \\
    -H "Authorization: Bearer $JWT_TOKEN" \\
    -H "X-Tenant-ID: $TENANT_ID" \\
    -H "Content-Type: application/json" \\
    -d '{}' \\
    $BASE_URL/${entityName}s | jq '.'

print_test "VALIDATION: Crear con nombre muy corto"
curl -s -X POST \\
    -H "Authorization: Bearer $JWT_TOKEN" \\
    -H "X-Tenant-ID: $TENANT_ID" \\
    -H "Content-Type: application/json" \\
    -d '{"name": "ab"}' \\
    $BASE_URL/${entityName}s | jq '.'
` : ''}

${scenarios.includes('not_found') ? `
# Not Found Tests
print_test "NOT FOUND: Obtener con ID inexistente"
curl -s -X GET \\
    -H "Authorization: Bearer $JWT_TOKEN" \\
    -H "X-Tenant-ID: $TENANT_ID" \\
    $BASE_URL/${entityName}s/non-existent-id | jq '.'

print_test "NOT FOUND: Actualizar con ID inexistente"
curl -s -X PUT \\
    -H "Authorization: Bearer $JWT_TOKEN" \\
    -H "X-Tenant-ID: $TENANT_ID" \\
    -H "Content-Type: application/json" \\
    -d '{"name": "Test"}' \\
    $BASE_URL/${entityName}s/non-existent-id | jq '.'
` : ''}

${scenarios.includes('unauthorized') ? `
# Authorization Tests
print_test "UNAUTHORIZED: Sin token JWT"
curl -s -X GET \\
    -H "X-Tenant-ID: $TENANT_ID" \\
    $BASE_URL/${entityName}s | jq '.'

print_test "UNAUTHORIZED: Sin Tenant ID"
curl -s -X GET \\
    -H "Authorization: Bearer $JWT_TOKEN" \\
    $BASE_URL/${entityName}s | jq '.'
` : ''}

echo -e "\\n${GREEN}Pruebas completadas!${NC}\\n"`;
  }

  generatePostmanCollection(servicePath, moduleName, entityName, port, endpoints) {
    const entityClass = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    
    return {
      info: {
        name: `${entityClass} API - ${moduleName}`,
        description: `Colección de pruebas para el módulo ${moduleName} del servicio ${servicePath}`,
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      auth: {
        type: "bearer",
        bearer: [
          {
            key: "token",
            value: "{{jwt_token}}",
            type: "string"
          }
        ]
      },
      variable: [
        {
          key: "base_url",
          value: `http://localhost:${port}`,
          type: "string"
        },
        {
          key: "jwt_token",
          value: "",
          type: "string"
        },
        {
          key: "tenant_id",
          value: "test-tenant-id",
          type: "string"
        },
        {
          key: `${entityName}_id`,
          value: "",
          type: "string"
        }
      ],
      item: endpoints.map(endpoint => this.generatePostmanItem(endpoint, entityName, entityClass))
    };
  }

  generatePostmanItem(endpoint, entityName, entityClass) {
    const item = {
      name: endpoint.description,
      request: {
        method: endpoint.method,
        header: [
          {
            key: "X-Tenant-ID",
            value: "{{tenant_id}}",
            type: "text"
          },
          {
            key: "Content-Type",
            value: "application/json",
            type: "text"
          }
        ],
        url: {
          raw: `{{base_url}}${endpoint.path.replace(':id', `{{${entityName}_id}}`)}`,
          host: ["{{base_url}}"],
          path: endpoint.path.replace(':id', `{{${entityName}_id}}`).split('/').filter(p => p)
        }
      }
    };

    // Agregar body para POST y PUT
    if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
      item.request.body = {
        mode: "raw",
        raw: JSON.stringify({
          name: `Test ${entityClass}`,
          active: true
        }, null, 2),
        options: {
          raw: {
            language: "json"
          }
        }
      };
    }

    // Agregar query params para GET list
    if (endpoint.method === 'GET' && !endpoint.path.includes(':id')) {
      item.request.url.query = [
        { key: "page", value: "1" },
        { key: "page_size", value: "10" },
        { key: "sort_by", value: "created_at" },
        { key: "sort_dir", value: "desc" }
      ];
    }

    // Agregar scripts de test
    if (endpoint.method === 'POST') {
      item.event = [{
        listen: "test",
        script: {
          exec: [
            `pm.test("Status code is 201", function () {`,
            `    pm.response.to.have.status(201);`,
            `});`,
            ``,
            `pm.test("Response has ID", function () {`,
            `    var jsonData = pm.response.json();`,
            `    pm.expect(jsonData).to.have.property('id');`,
            `    pm.collectionVariables.set("${entityName}_id", jsonData.id);`,
            `});`
          ],
          type: "text/javascript"
        }
      }];
    }

    return item;
  }

  async updateProjectTracking(args) {
    const { tracking_file = 'documentation/PROJECT_TRACKING.md', completed_tasks = [], new_tasks = [] } = args;
    
    try {
      const projectRoot = this.detectProjectRoot();
      const trackingPath = path.join(projectRoot, tracking_file);
      
      // Crear archivo si no existe
      if (!fs.existsSync(trackingPath)) {
        const initialContent = `# Project Tracking - SaaS MT

## 📊 Estado del Proyecto

### ✅ Tareas Completadas

### 🚧 Tareas en Progreso

### 📋 Tareas Pendientes

## 📈 Historial de Cambios
`;
        await fs.ensureDir(path.dirname(trackingPath));
        await fs.writeFile(trackingPath, initialContent);
      }

      // Leer contenido actual
      let content = await fs.readFile(trackingPath, 'utf8');
      
      // Actualizar tareas completadas
      if (completed_tasks.length > 0) {
        const completedSection = completed_tasks.map(task => 
          `- [x] **${task.task_name}** (${task.completion_date || new Date().toISOString().split('T')[0]})
  - Componente: ${task.component_type}
  ${task.notes ? `- Notas: ${task.notes}` : ''}`
        ).join('\n');

        // Insertar después de "### ✅ Tareas Completadas"
        content = content.replace(
          /### ✅ Tareas Completadas\n/,
          `### ✅ Tareas Completadas\n${completedSection}\n`
        );
      }

      // Agregar nuevas tareas
      if (new_tasks.length > 0) {
        const newTasksSection = new_tasks.map(task =>
          `- [ ] **${task.task_name}** (${task.priority})
  - ${task.description}
  - Tiempo estimado: ${task.estimated_time}`
        ).join('\n');

        // Insertar después de "### 📋 Tareas Pendientes"
        content = content.replace(
          /### 📋 Tareas Pendientes\n/,
          `### 📋 Tareas Pendientes\n${newTasksSection}\n`
        );
      }

      // Agregar entrada en historial
      const historyEntry = `
### ${new Date().toISOString().split('T')[0]} - Actualización
${completed_tasks.length > 0 ? `- Completadas: ${completed_tasks.map(t => t.task_name).join(', ')}` : ''}
${new_tasks.length > 0 ? `- Agregadas: ${new_tasks.map(t => t.task_name).join(', ')}` : ''}
`;
      content = content.replace(
        /## 📈 Historial de Cambios\n/,
        `## 📈 Historial de Cambios\n${historyEntry}\n`
      );

      // Guardar archivo actualizado
      await fs.writeFile(trackingPath, content);

      return {
        content: [
          {
            type: 'text',
            text: `📊 Tracking actualizado exitosamente!

📁 Archivo: ${trackingPath}

${completed_tasks.length > 0 ? `
✅ Tareas marcadas como completadas (${completed_tasks.length}):
${completed_tasks.map(t => `  - ${t.task_name}`).join('\n')}` : ''}

${new_tasks.length > 0 ? `
📋 Nuevas tareas agregadas (${new_tasks.length}):
${new_tasks.map(t => `  - ${t.task_name} (${t.priority})`).join('\n')}` : ''}

💡 El archivo de tracking mantiene un registro completo del progreso del proyecto.`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Error actualizando tracking: ${error.message}`);
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