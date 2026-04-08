#!/usr/bin/env node

/**
 * Script para garantir que o build rode no WSL quando executado no Windows
 * OpenNext tem problemas com symlinks no Windows
 */

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

const isWindows = os.platform() === 'win32';

function getWSLPath(windowsPath) {
  // Converte C:\Users\... para /mnt/c/Users/...
  const normalized = windowsPath.replace(/\\/g, '/');
  const match = normalized.match(/^([A-Za-z]):(.*)/);
  
  if (match) {
    const drive = match[1].toLowerCase();
    const pathPart = match[2];
    return `/mnt/${drive}${pathPart}`;
  }
  
  return normalized;
}

function runInWSL() {
  const cwd = process.cwd();
  const wslPath = getWSLPath(cwd);
  
  console.log('🔍 Windows detectado - executando build no WSL...');
  console.log(`📂 Diretório: ${wslPath}`);
  console.log('');
  
  try {
    // Executa o build DIRETO no WSL (não via pnpm script)
    execSync(
      `wsl bash -c "cd '${wslPath}' && npx @opennextjs/cloudflare build"`,
      { 
        stdio: 'inherit',
        encoding: 'utf-8'
      }
    );
    
    console.log('');
    console.log('✅ Build concluído com sucesso no WSL!');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Erro ao executar build no WSL');
    console.error('');
    console.error('Certifique-se de que:');
    console.error('1. WSL está instalado');
    console.error('2. pnpm está instalado no WSL');
    console.error('3. O projeto está acessível no WSL');
    console.error('');
    console.error('Tente manualmente:');
    console.error(`  wsl bash -c "cd '${wslPath}' && pnpm install && npx @opennextjs/cloudflare build"`);
    process.exit(1);
  }
}

function runNative() {
  console.log('🐧 Linux/Mac detectado - executando build nativo...');
  console.log('');
  
  try {
    // Executa o build DIRETO (não via pnpm script)
    execSync('npx @opennextjs/cloudflare build', { 
      stdio: 'inherit',
      encoding: 'utf-8'
    });
    
    console.log('');
    console.log('✅ Build concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Erro ao executar build');
    process.exit(1);
  }
}

// Main
if (isWindows) {
  runInWSL();
} else {
  runNative();
}
