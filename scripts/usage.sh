echo -e "\`\`\`\n$(node --loader ts-node/esm src/index.ts tampermonkey --help | tail -n +5)\n\`\`\`" >./USAGE.md
