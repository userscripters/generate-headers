#!/bin/bash

declare version=$(printenv | grep -e "npm_package_version" | cut -d \= -f 2)

npm run readme &&
    git commit --all --no-edit --amend &&
    git tag -af "v$version" -m "bumped version to $version"
