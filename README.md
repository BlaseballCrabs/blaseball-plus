# Blaseball+

## Building
Building is done via scripts defined in the package.json.

### Requirements
Development was done on [NixOS](https://nixos.org) 20.09. A `flake.nix` is provided, allowing for replication of the exact build environment. Nix flakes are currently a WIP feature and not fully documented, so you may want to instead install the system dependencies manually:

* Node.js 14.9.0 ([downloads](https://nodejs.org/download/release/v14.9.0/), [installation](https://github.com/nodejs/help/wiki/Installation))
* Yarn 1.22.5 ([installation](https://classic.yarnpkg.com/en/docs/install/))

### Instructions
Packages can be installed via `yarn`. After this, the following (relevant) scripts are available via `yarn run <script>`:

* `build:dev`: Builds an unsigned development .zip
* `build:prod:unsigned`: Builds an unsigned production .zip
* `build:prod:signed`: Builds a signed production .xpi
* `build`: Alias for `build:dev`

Artifacts are placed in `addon/web-ext-artifacts/`.
