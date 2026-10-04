# AppPortafolioV1

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.10.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Deploy (requiere tu aprobación)

El deploy ya no se publica desde tu máquina. Cada `push` a `master` dispara el workflow **Deploy** de GitHub Actions:

```bash
git add -A
git commit -m "..."
git push origin master
```

Y a partir de ahí:

1. El job **Build** compila el sitio.
2. El job **Publish to gh-pages** se queda en estado _Waiting for approval_.
3. GitHub te avisa por email y en la campanita. Desde esa notificación entras a **Review deployments** y eliges **Approve and deploy** o **Reject**.
4. Solo después de tu aprobación se publica en la rama `gh-pages` y el sitio se actualiza (tarda ~1 min).

Si rechazas, el workflow falla y el sitio se queda como estaba. Nada se publica sin tu OK.

- Ejecuciones: <https://github.com/marcosRMH/app-portafolio-v1/actions>
- Aprobaciones pendientes: <https://github.com/marcosRMH/app-portafolio-v1/deployments>
- Si no te llegan los avisos: **Settings → Notifications → Actions → Email**.

`ng deploy` ya no funciona en local (se eliminó el target `deploy` de `angular.json`): el único camino para publicar es el workflow.

### Configuración en GitHub (una sola vez)

1. **Variable con la URL del backend**
   _Settings → Secrets and variables → Actions → Variables → New repository variable_
   - Nombre: `PORTFOLIO_API_URL`
   - Valor: `https://o963mislve.execute-api.us-east-1.amazonaws.com`
   - Debe ser a nivel de **repo**, no del environment `produccion`: el job **Build** corre antes de tu aprobación y solo puede leer variables del repo.

2. **Environment con revisor requerido**
   _Settings → Environments → New environment_
   - Nombre: `produccion`
   - _Protection rules_ → **Required reviewers** → `marcosRMH` → _Save protection rules_
   - Deja _Prevent self-review_ desactivado: en un repo personal disparas y apruebas tú.

### `src/environments/environment.ts` es generado

Ese archivo no está en el repo: lo crea `scripts/generate-environment.mjs` en cada `build`, `start` o `watch` (hooks `prebuild` / `prestart` / `prewatch` de `package.json`) y está en `.gitignore`.

La URL sale de `URL_BASE_PORTFOLIO`, en este orden:

1. Variable de entorno `URL_BASE_PORTFOLIO`.
2. Tu archivo local `.env`.
3. En CI: la variable `PORTFOLIO_API_URL` de GitHub Actions.

Si no la encuentra, el build falla con un mensaje explicando dónde definirla.
