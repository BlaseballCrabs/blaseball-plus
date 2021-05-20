{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-20.09";
  inputs.nixpkgsEdge.url = "github:leo60228/nixpkgs/edge";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { nixpkgs, nixpkgsEdge, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        pkgsEdge = import nixpkgsEdge {
          inherit system;
          config.allowUnfree = true;
        };
      in {
        devShell = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [ nodejs_latest nodePackages_latest.yarn firefox chromium pkgsEdge.microsoft-edge-beta ];
        };
      }
    );
}
