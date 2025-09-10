@echo off
echo Instalando dependencias...
npm install

echo Copiando arquivos do projeto...
xcopy "..\estagiarios\*.*" "." /E /H /C /I /Y

echo Configurando banco de dados local...
mkdir data

echo Instalacao concluida!
echo Para iniciar o programa, execute: npm start
pause
