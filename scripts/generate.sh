#!/bin/bash

# Generates a json file with the list of files to include in the auto-complete libs

echo '['

echo '{ "name": "@stacks/common",'
echo '"files": '
find ./node_modules/@stacks/common -name "*.d.ts" -maxdepth 2 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/network",'
echo '"files": '
find ./node_modules/@stacks/network -name "*.d.ts" -maxdepth 2 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/transactions",'
echo '"files": '
find ./node_modules/@stacks/transactions -name "*.d.ts" -maxdepth 2 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/encryption",'
echo '"files": '
find ./node_modules/@stacks/encryption -name "*.d.ts" -maxdepth 2 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/profile",'
echo '"files": '
find ./node_modules/@stacks/profile -name "*.d.ts" -maxdepth 2 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/auth",'
echo '"files": '
find ./node_modules/@stacks/auth -name "*.d.ts" -maxdepth 2 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/storage",'
echo '"files": '
find ./node_modules/@stacks/storage -name "*.d.ts" -maxdepth 2 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/wallet-sdk",'
echo '"files": '
find ./node_modules/@stacks/wallet-sdk -name "*.d.ts" -maxdepth 2 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/stacking",'
echo '"files": '
find ./node_modules/@stacks/stacking -name "*.d.ts" -maxdepth 2 | sed 's|.*/dist|/dist|' | jq -R -s -c 'split("\n")[:-1]'
echo '},'

echo '{ "name": "@stacks/blockchain-api-client",'
echo '"files": '
find ./node_modules/@stacks/blockchain-api-client/lib -name "*.d.ts" -maxdepth 3 | sed 's|.*/lib|/lib|' | jq -R -s -c 'split("\n")[:-1]'
echo '}'

echo ']'
