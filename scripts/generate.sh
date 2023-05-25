#!/bin/bash

# Generates a json file with the list of files to include in the auto-complete libs

echo '['

echo '{ "name": "@stacks/common",'
echo "\"version\": \"$(jq -r '.devDependencies["@stacks/common"]' package.json | sed 's/\^//')\","
echo '"files": '
find ./node_modules/@stacks/common -name "*.d.ts" -maxdepth 3 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/network",'
echo "\"version\": \"$(jq -r '.devDependencies["@stacks/network"]' package.json | sed 's/\^//')\","
echo '"files": '
find ./node_modules/@stacks/network -name "*.d.ts" -maxdepth 3 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/transactions",'
echo "\"version\": \"$(jq -r '.devDependencies["@stacks/transactions"]' package.json | sed 's/\^//')\","
echo '"files": '
find ./node_modules/@stacks/transactions -name "*.d.ts" -maxdepth 3 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/encryption",'
echo "\"version\": \"$(jq -r '.devDependencies["@stacks/encryption"]' package.json | sed 's/\^//')\","
echo '"files": '
find ./node_modules/@stacks/encryption -name "*.d.ts" -maxdepth 3 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/profile",'
echo "\"version\": \"$(jq -r '.devDependencies["@stacks/profile"]' package.json | sed 's/\^//')\","
echo '"files": '
find ./node_modules/@stacks/profile -name "*.d.ts" -maxdepth 3 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/auth",'
echo "\"version\": \"$(jq -r '.devDependencies["@stacks/auth"]' package.json | sed 's/\^//')\","
echo '"files": '
find ./node_modules/@stacks/auth -name "*.d.ts" -maxdepth 3 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/storage",'
echo "\"version\": \"$(jq -r '.devDependencies["@stacks/storage"]' package.json | sed 's/\^//')\","
echo '"files": '
find ./node_modules/@stacks/storage -name "*.d.ts" -maxdepth 3 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/wallet-sdk",'
echo "\"version\": \"$(jq -r '.devDependencies["@stacks/wallet-sdk"]' package.json | sed 's/\^//')\","
echo '"files": '
find ./node_modules/@stacks/wallet-sdk -name "*.d.ts" -maxdepth 3 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/stacking",'
echo "\"version\": \"$(jq -r '.devDependencies["@stacks/stacking"]' package.json | sed 's/\^//')\","
echo '"files": '
find ./node_modules/@stacks/stacking -name "*.d.ts" -maxdepth 3 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/blockchain-api-client",'
echo "\"version\": \"$(jq -r '.devDependencies["@stacks/blockchain-api-client"]' package.json | sed 's/\^//')\","
echo '"files": '
find ./node_modules/@stacks/blockchain-api-client/lib -name "*.d.ts" -maxdepth 3 | sed 's|.*/lib|/lib|' | jq -R -s -c 'split("\n")[:-1]'
echo '}'

echo ']'
