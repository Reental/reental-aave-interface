import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ['https://reental-ponder-server-production.up.railway.app'],
  documents: './src/libs/reental/gql/documents/**/*.ts',
  generates: {
    './src/libs/reental/gql/types/': {
      preset: 'client-preset',
    },
  },
};
export default config;
