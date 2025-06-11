#!/bin/bash

echo "🔄 Reiniciando MCP Go Generator Node..."

# Matar todos los procesos de Node.js que contengan mcp-go-generator
pkill -f "mcp-go-generator-node"

echo "✅ Procesos del MCP terminados"
echo "ℹ️  Para que Cursor tome los cambios, necesitas:"
echo "   1. Cerrar Cursor completamente"
echo "   2. Reabrir Cursor"
echo "   3. El MCP se reiniciará automáticamente"

echo ""
echo "🔧 Estado del proyecto:"
echo "   - Ubicación: $(pwd)"
echo "   - Directorio services existe: $(test -d services && echo "✅ Sí" || echo "❌ No")"
echo "   - Archivo docker-compose.yml existe: $(test -f docker-compose.yml && echo "✅ Sí" || echo "❌ No")"
echo "   - Archivo go.mod existe: $(test -f go.mod && echo "✅ Sí" || echo "❌ No")" 