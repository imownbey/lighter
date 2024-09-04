import type { IRawGrammar } from "vscode-textmate";
import { importGrammar } from "./dynamic-imports";
import { scopeToLangData } from "./language";

const sourceToGrammarPromise = new Map<string, Promise<IRawGrammar>>();

let shouldUseFileSystemPromise: undefined | Promise<boolean> = undefined;
let shouldUseFileSystem: undefined | boolean = undefined;

export async function loadGrammarByScope(
  scope: string
): Promise<IRawGrammar | undefined> {
  if (sourceToGrammarPromise.has(scope)) {
    return sourceToGrammarPromise.get(scope);
  }

  // we don't have all the scopes, usually not a problem
  const lang = scopeToLangData(scope);
  if (!lang) {
    return Promise.resolve(undefined);
  }

  let grammarPromise: undefined | Promise<IRawGrammar> = undefined;

  if (shouldUseFileSystemPromise === undefined) {
    grammarPromise = importGrammar(lang.id);
    shouldUseFileSystemPromise = grammarPromise
      .then(() => true)
      .catch(() => false);
  }

  if (shouldUseFileSystem === undefined) {
    shouldUseFileSystem = await shouldUseFileSystemPromise;
  }

  if (shouldUseFileSystem) {
    const promise = grammarPromise || importGrammar(lang.id);
    sourceToGrammarPromise.set(scope, promise);
    return promise;
  }

  const fetchPromise = importGrammar(lang.id) as Promise<IRawGrammar[]>;

  const subScopes = lang.embeddedScopes;
  subScopes.forEach((subScope) => {
    if (!sourceToGrammarPromise.has(subScope)) {
      const subPromise = fetchPromise.then((gs) =>
        gs?.find((g) => g.scopeName === subScope)
      );

      sourceToGrammarPromise.set(subScope, subPromise);
    }
  });

  const promise = fetchPromise.then((gs: IRawGrammar[]) =>
    gs?.find((g) => g.scopeName === scope)
  );
  sourceToGrammarPromise.set(scope, promise);
  return promise;
}
