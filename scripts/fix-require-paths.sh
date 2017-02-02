#!/usr/bin/env bash

local_path=$(pwd)
docker_path="/opt/app"

find app/.next/dist -type f -name '*.js' | xargs sed -i '' "s:${local_path}:${docker_path}:g"
