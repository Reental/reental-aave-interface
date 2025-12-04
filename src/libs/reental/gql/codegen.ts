import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ['https://ponder-pro.reental.eu/graphql'],
  // schema: ['http://localhost:42069'],
  documents: './src/libs/reental/gql/documents/**/*.ts',
  generates: {
    './src/libs/reental/gql/types/': {
      preset: 'client-preset',
    },
  },
};
export default config;
