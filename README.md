# Blaseball+

## Building
Building is done via scripts defined in the package.json.

### Requirements
Development was done on NixOS 20.09. A `flake.nix` is provided, allowing for replication of the exact build environment. Alternatively, the following versions can be installed:

* Node.js 14.9.0
* Yarn 1.22.5

### Instructions
Packages can be installed via `yarn`. After this, the following (relevant) scripts are available via `yarn run <script>`:

* `build:dev`: Builds an unsigned development .zip
* `build:prod:unsigned`: Builds an unsigned production .zip
* `build:prod:signed`: Builds a signed production .xpi
* `build`: Alias for `build:dev`

Artifacts are placed in `addon/web-ext-artifacts/`.
