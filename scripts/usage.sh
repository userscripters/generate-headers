echo -e "\`\`\`\n$(node --loader ts-node/esm src/cli.ts tampermonkey --help | tail -n +5)\n\`\`\`" >./USAGE.md
