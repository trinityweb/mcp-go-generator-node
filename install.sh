#!/bin/bash

echo "🚀 Instalando MCP Go Generator Node.js..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio mcp-go-generator-node"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Hacer el archivo ejecutable
chmod +x src/index.js

echo "✅ MCP Go Generator Node.js instalado correctamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Copia la configuración de cursor-config.json a tu configuración de Cursor"
echo "2. Reinicia Cursor"
echo "3. ¡Usa el MCP!"
echo ""
echo "🔧 Configuración para Cursor:"
cat cursor-config.json
echo ""
echo "💡 Para probar manualmente:"
echo "   node src/index.js" 