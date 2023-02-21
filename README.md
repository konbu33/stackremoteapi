# Stack Remote API

## .env setting

## emulator start

1. git clone
2. cd stackremoteapi
3. firebase init functions

```sh
    ? Would you like to initialize a new codebase, or overwrite an existing one? Overwrite

    Overwriting codebase default...

    ? What language would you like to use to write Cloud Functions? TypeScript
    ? Do you want to use ESLint to catch probable bugs and enforce style? Yes
    ? File functions/package.json already exists. Overwrite? No
    i  Skipping write of functions/package.json
    ? File functions/.eslintrc.js already exists. Overwrite? No
    i  Skipping write of functions/.eslintrc.js
    ? File functions/tsconfig.json already exists. Overwrite? No
    i  Skipping write of functions/tsconfig.json
    ? File functions/tsconfig.dev.json already exists. Overwrite? No
    i  Skipping write of functions/tsconfig.dev.json
    ? File functions/src/index.ts already exists. Overwrite? No
    i  Skipping write of functions/src/index.ts
    ? File functions/.gitignore already exists. Overwrite? No
    i  Skipping write of functions/.gitignore
    ? Do you want to install dependencies with npm now? Yes
```

4. cd functions

5. set .env

```sh
cp .env.sample .env
```

6. npm install
7. npm run test
8. npm run serve

## app deploy

```sh
./functions_deploy.sh
```
