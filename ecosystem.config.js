// Se invoca el binario de Next directamente, no "pnpm start", para no depender
// de que pnpm este en el PATH del proceso que lanza PM2.
//
// next.config.mjs SI declara output: "standalone", de modo que el build genera
// .next/standalone/server.js; ese es el arranque que usa el Dockerfile. Aqui se
// mantiene "next start" porque PM2 corre sobre el arbol completo del proyecto,
// donde ya estan todas las dependencias y no hace falta la salida reducida.
module.exports = {
  apps: [
    {
      name: "suminia-frontend",
      cwd: "/var/www/Suminia/suminia-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3000",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      ignore_watch: ["node_modules", "logs", ".next"],
      time: true
    }
  ]
};
