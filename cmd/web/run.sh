#!/bin/sh

# set -euo pipefail
IFS=$'\n\t'

usage() { echo "Usage: run-container.sh -e <nodeEnv> -i <ApiUrl>" 1>&2; exit 1; }

# Initialize parameters specified from command line
while getopts ":i:" arg; do
    case "${arg}" in
        i)
            ApiUrl=${OPTARG}
        ;;
    esac
done
shift $((OPTIND-1))

#Prompt for parameters is some required parameters are missing

if [[ -z "$ApiUrl" ]]; then
    if [[ -z "$API_URL" ]]; then
        echo "API_URL env or -i is not specified "
        exit 1
    fi
    ApiUrl=$API_URL
fi

echo "=========================================="
echo "=  IHAQ - WEB - Docker Container ="
echo "= run-container - version 1.0 - Julien S ="
echo "=========================================="
echo "VARIABLES"
echo "=========================================="
echo "ApiUrl        = "${ApiUrl}
echo "=========================================="

cat > env.js <<EOF
window.APP_CONFIG = {
    REACT_APP_API_SVC: "$ApiUrl"
}
EOF

cat env.js
mv env.js /var/www/env.js

# export REACT_APP_API_SVC=$ApiUrl

echo "Running Nginx"
nginx -g "daemon off;"
