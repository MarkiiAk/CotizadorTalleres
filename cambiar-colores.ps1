# Script para cambiar colores green/emerald a sag en todo el proyecto

$archivos = Get-ChildItem -Path "src" -Include *.tsx,*.ts,*.jsx,*.js,*.css -Recurse

foreach ($archivo in $archivos) {
    $contenido = Get-Content $archivo.FullName -Raw
    $modificado = $false
    
    # Reemplazar green- por sag-
    if ($contenido -match "green-") {
        $contenido = $contenido -replace "green-", "sag-"
        $modificado = $true
    }
    
    # Reemplazar emerald- por sag-
    if ($contenido -match "emerald-") {
        $contenido = $contenido -replace "emerald-", "sag-"
        $modificado = $true
    }
    
    # Reemplazar from-green- y to-green- por from-sag- y to-sag-
    if ($contenido -match "from-green-|to-green-") {
        $contenido = $contenido -replace "from-green-", "from-sag-"
        $contenido = $contenido -replace "to-green-", "to-sag-"
        $modificado = $true
    }
    
    # Reemplazar from-emerald- y to-emerald- por from-sag- y to-sag-
    if ($contenido -match "from-emerald-|to-emerald-") {
        $contenido = $contenido -replace "from-emerald-", "from-sag-"
        $contenido = $contenido -replace "to-emerald-", "to-sag-"
        $modificado = $true
    }
    
    if ($modificado) {
        Set-Content -Path $archivo.FullName -Value $contenido -NoNewline
        Write-Host "Actualizado: $($archivo.FullName)"
    }
}

Write-Host "`nCambio de colores completado!"