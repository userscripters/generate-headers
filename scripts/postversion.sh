#!/bin/bash

declare version=$(printenv | grep -e "npm_package_version" | tail -c 6)

generate-readme &&
    git commit --all --no-edit --amend &&
    git tag -af $(git tag --list | tail -n 1) -m "bumped version to $version"
