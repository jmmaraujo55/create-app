const { execSync } = require("child_process");
const { program, Argument } = require("commander");
const fs = require("fs");
const { join } = require("path");

const logger = require("./logger");

program
  .option("--force", "remove directory if exists")
  .option("--yarn", "use yarn")
  .addArgument(new Argument("[name]", "app name").argRequired());

program.parse();

const { force, yarn } = program.opts();
const { 0: appname } = program.processedArgs;
const baseDir = join(__dirname, "..", `templates/ts`);
const baseFiles = loadFiles(`${baseDir}/base`);
const packageFile = require(`${join(
  __dirname,
  ".."
)}/templates/ts/package.json.js`);

function loadFiles(path) {
  if (!path) {
    throw new Error("invalid path");
  }

  const files = {};
  const filenames = fs.readdirSync(path);

  for (const filename of filenames) {
    files[filename] = fs.readFileSync(`${path}/${filename}`, "utf8");
  }

  return files;
}

function createApp() {
  try {
    if (force && fs.existsSync(appname)) {
      fs.rmSync(appname, { recursive: true });
    }

    if (fs.existsSync(appname)) {
      throw new Error("directory already exists");
    }

    logger.info("build start");

    packageFile.name = appname;
    packageFile.dependencies.express = "^4.18.1";
    packageFile.dependencies.joi = "^17.6.0";
    packageFile.dependencies.morgan = "^1.10.0";
    packageFile.devDependencies["@types/express"] = "^4.17.13";

    logger.info("build files");

    buildBaseFiles(baseDir, appname);

    for (const key in baseFiles) {
      fs.writeFileSync(`${appname}/${key}`, baseFiles[key]);
    }

    execSync(`cp -r ${baseDir}/utils ${appname}/src`);
    execSync(`cp -r ${baseDir}/utils ${appname}/src`);

    buildApiFiles(baseDir, appname);
    packageFile.dependencies = Object.keys(packageFile.dependencies)
      .sort()
      .reduce((obj, key) => {
        obj[key] = packageFile.dependencies[key];
        return obj;
      }, {});
    packageFile.devDependencies = Object.keys(packageFile.devDependencies)
      .sort()
      .reduce((obj, key) => {
        obj[key] = packageFile.devDependencies[key];
        return obj;
      }, {});

    fs.writeFileSync(
      `${appname}/package.json`,
      JSON.stringify(packageFile, undefined, 2)
    );

    logger.info("installing dependencies...");

    installDeps();

    logger.success("app build successfully");
  } catch (error) {
    logger.error(error);
  }
}

function buildBaseFiles(baseDir, appname) {
  fs.mkdirSync(appname);
  fs.mkdirSync(`${appname}/src`);
  fs.mkdirSync(`${appname}/src/config`);
  fs.mkdirSync(`${appname}/__tests__`);
  fs.copyFileSync(`${baseDir}/index.ts`, `${appname}/index.ts`);
  fs.copyFileSync(`${baseDir}/App.ts`, `${appname}/src/App.ts`);
  fs.copyFileSync(
    `${baseDir}/environment.ts`,
    `${appname}/src/config/environment.ts`
  );
}

function buildApiFiles(baseDir, appname) {
  fs.mkdirSync(`${appname}/src/server`);
  fs.mkdirSync(`${appname}/src/server/routes`);
  fs.mkdirSync(`${appname}/src/server/services`);
  fs.mkdirSync(`${appname}/src/server/controllers`);
  fs.mkdirSync(`${appname}/src/server/middlewares`);

  fs.copyFileSync(`${baseDir}/api/server.ts`, `${appname}/src/server/index.ts`);

  // routes
  fs.copyFileSync(
    `${baseDir}/api/router.ts`,
    `${appname}/src/server/routes/index.ts`
  );
  fs.copyFileSync(
    `${baseDir}/api/example.route.ts`,
    `${appname}/src/server/routes/example.route.ts`
  );

  // services
  fs.copyFileSync(
    `${baseDir}/api/example.service.ts`,
    `${appname}/src/server/services/example.service.ts`
  );

  // controllers
  fs.copyFileSync(
    `${baseDir}/api/example.controller.ts`,
    `${appname}/src/server/controllers/example.controller.ts`
  );

  // middlewares
  fs.copyFileSync(
    `${baseDir}/api/joi.middleware.ts`,
    `${appname}/src/server/middlewares/joi.middleware.ts`
  );
}

function installDeps() {
  execSync(yarn ? `cd ${appname} && yarn` : `cd ${appname} && npm i`, {
    stdio: "ignore",
  });
  execSync(
    yarn ? `cd ${appname} && yarn format` : `cd ${appname} && npm run format`
  );

  execSync(
    `cd ${appname} && git init && npx husky install && npx husky add .husky/pre-commit "npm run build"`,
    { stdio: "ignore" }
  );
}

createApp();
