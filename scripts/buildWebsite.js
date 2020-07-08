/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const tempy = require('tempy');
const fs = require('fs-extra');
const packageJSON = require('../package.json');
const path = require('path');
const glob = require('fast-glob');
const {spawn, execSync} = require('child_process');

build().catch(err => {
  console.error(err.stack);
  process.exit(1);
});

async function build() {
  // Create a temp directory to build the site in
  let dir = tempy.directory();
  console.log(`Building into ${dir}...`);

  // Generate a package.json containing just what we need to build the website
  let pkg = {
    name: 'rsp-website',
    version: '0.0.0',
    private: true,
    workspaces: [
      'packages/*/*'
    ],
    devDependencies: Object.fromEntries(
      Object.entries(packageJSON.devDependencies)
        .filter(([name]) =>
          name.startsWith('@parcel') ||
          name === 'parcel' ||
          name === 'patch-package' ||
          name.startsWith('@spectrum-css') ||
          name.startsWith('postcss')
        )
    ),
    dependencies: {},
    resolutions: packageJSON.resolutions,
    browserslist: packageJSON.browserslist,
    scripts: {
      build: "PARCEL_WORKER_BACKEND=process parcel build 'docs/*/*/docs/*.mdx' 'packages/dev/docs/pages/**/*.mdx' --no-scope-hoist",
      postinstall: 'patch-package'
    }
  };

  // Add dependencies on each published package to the package.json, and
  // copy the docs from the current package into the temp dir.
  let packagesDir = path.join(__dirname, '..', 'packages');
  let packages = glob.sync('*/*/package.json', {cwd: packagesDir});
  for (let p of packages) {
    let json = JSON.parse(fs.readFileSync(path.join(packagesDir, p), 'utf8'));
    if (!json.private && json.name !== '@adobe/react-spectrum') {
      pkg.dependencies[json.name] = 'latest';

      let docsDir = path.join(packagesDir, path.dirname(p), 'docs');
      if (fs.existsSync(docsDir)) {
        fs.copySync(docsDir, path.join(dir, 'docs', json.name, 'docs'));
      }
    }
  }

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, false, 2));

  // Copy necessary code and configuration over
  fs.copySync(path.join(__dirname, '..', 'yarn.lock'), path.join(dir, 'yarn.lock'));
  fs.copySync(path.join(__dirname, '..', 'packages', 'dev'), path.join(dir, 'packages', 'dev'));
  fs.copySync(path.join(__dirname, '..', 'packages', '@adobe', 'spectrum-css-temp'), path.join(dir, 'packages', '@adobe', 'spectrum-css-temp'));
  fs.copySync(path.join(__dirname, '..', '.parcelrc'), path.join(dir, '.parcelrc'));
  fs.copySync(path.join(__dirname, '..', 'cssnano.config.js'), path.join(dir, 'cssnano.config.js'));
  fs.copySync(path.join(__dirname, '..', 'postcss.config.js'), path.join(dir, 'postcss.config.js'));
  fs.copySync(path.join(__dirname, '..', 'patches'), path.join(dir, 'patches'));
  fs.copySync(path.join(__dirname, '..', 'lib'), path.join(dir, 'lib'));

  // Install and build
  await run('yarn', {cwd: dir, stdio: 'inherit'});
  await run('yarn', ['build'], {cwd: dir, stdio: 'inherit'});

  // Copy the build back into dist, and delete the temp dir.
  fs.copySync(path.join(dir, 'dist'), path.join(__dirname, '..', 'dist', 'master', 'docs'));
  fs.removeSync(dir);
}

function run(cmd, args, opts) {
  return new Promise((resolve, reject) => {
    let child = spawn(cmd, args, opts);
    child.on('error', reject);
    child.on('close', code => {
      if (code !== 0) {
        reject(new Error('Child process failed'));
        return;
      }

      resolve();
    })
  });
}
