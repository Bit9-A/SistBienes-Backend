#!/bin/bash

# Script de actualización para SistBienes Backend
# Uso: ./update.sh

set -e  # Detener en caso de error

echo "🔄 Actualizando SistBienes Backend..."
echo "======================================"

# Navegar al directorio del backend
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. ¿Estás en el directorio correcto?"
    exit 1
fi

# Detener la aplicación
echo "⏸️  Deteniendo aplicación..."
pm2 stop sistbienes-backend || echo "⚠️  La aplicación no estaba corriendo"

# Guardar cambios locales (si los hay)
if [ -n "$(git status --porcelain)" ]; then
    echo "💾 Guardando cambios locales..."
    git stash
    STASHED=true
else
    STASHED=false
fi

# Obtener últimos cambios
echo "📥 Obteniendo últimos cambios del repositorio..."
git pull origin main || git pull origin master

# Restaurar cambios locales si se guardaron
if [ "$STASHED" = true ]; then
    echo "♻️  Restaurando cambios locales..."
    git stash pop
fi

# Instalar/actualizar dependencias
echo "📦 Instalando dependencias..."
npm install --production

# Compilar el proyecto
echo "🔨 Compilando proyecto TypeScript..."
npm run build

# Verificar que la compilación fue exitosa
if [ ! -d "dist" ]; then
    echo "❌ Error: La compilación falló. No se encontró el directorio dist/"
    exit 1
fi

# Reiniciar la aplicación
echo "🚀 Reiniciando aplicación..."
pm2 restart sistbienes-backend

# Guardar configuración de PM2
pm2 save

# Esperar un momento para que la aplicación inicie
sleep 3

# Verificar estado
echo ""
echo "📊 Estado de la aplicación:"
pm2 status sistbienes-backend

echo ""
echo "✅ Backend actualizado correctamente"
echo ""
echo "📝 Para ver los logs en tiempo real, ejecuta:"
echo "   pm2 logs sistbienes-backend"
