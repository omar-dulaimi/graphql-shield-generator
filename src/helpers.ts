import path from 'path';
import { cwd } from 'process';
import type { CustomPath, RootType } from './types';

export const constructShield = ({
  queries,
  mutations,
  subscriptions,
}: {
  queries: RootType;
  mutations: RootType;
  subscriptions: RootType;
}) => {
  if (queries.length === 0 && mutations.length === 0 && subscriptions.length === 0) {
    return '';
  }

  let rootItems = '';
  if (queries.length > 0) {
    const queryLinesWrapped = `Query: ${wrapWithObject({
      shieldItemLines: queries.map((query) => `${query}: allow`),
    })},`;
    rootItems += queryLinesWrapped;
  }
  if (mutations.length > 0) {
    const mutationLinesWrapped = `Mutation: ${wrapWithObject({
      shieldItemLines: mutations.map((mutation) => `${mutation}: allow`),
    })},`;
    rootItems += mutationLinesWrapped;
  }

  if (subscriptions.length > 0) {
    const subscriptionLinesWrapped = `Subscription: ${wrapWithObject({
      shieldItemLines: subscriptions.map((subscription) => `${subscription}: allow`),
    })},`;
    rootItems += subscriptionLinesWrapped;
  }

  if (rootItems.length === 0) return '';
  let shieldText = getImports('graphql-shield');
  shieldText += '\n\n';
  shieldText += wrapWithExport({
    shieldObjectText: wrapWithTrpcShieldCall({
      shieldObjectTextWrapped: wrapWithObject({ shieldItemLines: rootItems }),
    }),
  });

  return shieldText;
};

export const getOutputPath = (customPath: CustomPath, js: boolean) => {
  const ext = js ? 'js' : 'ts';
  let filePath = customPath.path ? path.resolve(cwd(), customPath?.path, 'shield') : path.join(cwd(), 'shield');

  filePath = path.format({
    dir: path.dirname(filePath),
    name: path.basename(filePath, path.extname(filePath)),
    ext: `.${ext}`,
  });
  return filePath;
};

export const sortShieldItems = (queries: RootType[], mutations: RootType[], subscriptions: RootType[]) => {
  queries.sort();
  mutations.sort();
  subscriptions.sort();
};

export const wrapWithObject = ({ shieldItemLines }: { shieldItemLines: Array<string> | string }) => {
  let wrapped = '{';
  wrapped += '\n';
  wrapped += Array.isArray(shieldItemLines) ? '  ' + shieldItemLines.join(',\r\n') : '  ' + shieldItemLines;
  wrapped += '\n';
  wrapped += '}';
  return wrapped;
};

export const getImports = (type: 'graphql-shield') => {
  const trpcShieldImportStatement = "import { shield, allow } from 'graphql-shield';\n";
  return trpcShieldImportStatement;
};

export const wrapWithExport = ({ shieldObjectText }: { shieldObjectText: string }) => {
  return `export const permissions = ${shieldObjectText};`;
};

export const wrapWithTrpcShieldCall = ({ shieldObjectTextWrapped }: { shieldObjectTextWrapped: string }) => {
  let wrapped = 'shield(';
  wrapped += '\n';
  wrapped += '  ' + shieldObjectTextWrapped;
  wrapped += '\n';
  wrapped += ')';
  return wrapped;
};
