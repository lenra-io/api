#!/bin/bash
# Needs CURL to be installed

function get_content() { #$1: type, $2: default value
  file="lenra-api.$1.txt"
  if [ -f "$file" ]; then
    echo "$(cat $file | grep -Ev '^#|^\s*$' | sed 's/\s+//g')"
  elif [ "$2" == "" ]; then
    exit 1
  else
    echo "$2"
  fi
}

api_version=$(get_content 'version')
api_files=$(get_content 'files' '*')

function main() {
  mkdir -p api
  # get the API version from the API dir
  current_api_version=$(cat api/api-version.txt || echo "")

  # if the versions don't match, then we need to load the new API
  if [ "$api_version" != "$current_api_version" ]; then
    echo "Loading API version $api_version"

    # download the API archive
    curl -Ls -o api/api.tar.gz "https://github.com/lenra-io/api/releases/download/v${api_version}/api.tar.gz"
    
    # save the new API version
    echo $api_version > api/api-version.txt
  fi

  cd api

  # load the new API files
  while IFS= read -r file; do
      if [ ! -f "$file" ]; then
        echo "Extracting $file from API version $api_version"
        # extract the file from the archive
        tar -xzf api.tar.gz $file
      fi
  done <<< "$api_files"
}

main