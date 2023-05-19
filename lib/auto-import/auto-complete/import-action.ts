import * as Monaco from "monaco-editor";

import { IMPORT_COMMAND } from "./import-completion";
import ImportDb, { ImportObject } from "./import-db";
import { ImportFixer } from "./import-fixer";

export interface Context {
  document: Monaco.editor.ITextModel;
  range: Monaco.Range;
  context: Monaco.languages.CodeActionContext;
  token: Monaco.CancellationToken;
  imports?: ImportObject[];
}

export class ImportAction implements Monaco.languages.CodeActionProvider {
  constructor(
    private editor: Monaco.editor.IStandaloneCodeEditor,
    private importDb: ImportDb
  ) {
    editor.updateOptions({
      lightbulb: {
        enabled: true,
      },
    });
  }

  public provideCodeActions(
    document: Monaco.editor.ITextModel,
    range: Monaco.Range,
    context: Monaco.languages.CodeActionContext,
    token: Monaco.CancellationToken
  ): Monaco.languages.CodeActionList | undefined {
    const actionContext = { document, range, context, token };
    if (!this.canHandleAction(actionContext)) return undefined;
    return this.actionHandler(actionContext);
  }

  private canHandleAction(context: Context): boolean {
    if (!context.context.markers) return false;

    let [diagnostic] = context.context.markers;
    if (!diagnostic) return false;

    if (
      diagnostic.message.startsWith("Typescript Cannot find name") ||
      diagnostic.message.startsWith("Cannot find name")
    ) {
      const imp = diagnostic.message
        .replace("Typescript Cannot find name", "")
        .replace("Cannot find name", "")
        .replace(/{|}|from|import|'|"| |\.|;/gi, "");

      const found = this.importDb.getImports(imp);
      if (found.length) {
        context.imports = found;
        return true;
      }
    }
    return false;
  }

  private actionHandler(context: Context): Monaco.languages.CodeActionList {
    const path = ({ file }: ImportObject) => {
      return file.aliases?.[0] || file.path;
    };

    return {
      actions:
        context.imports?.map((i) => ({
          title: `Import '${i.name}' from module "${path(i)}"`,
          edit: {
            edits: new ImportFixer(this.editor).editsWorkspace(
              context.document,
              i
            ),
          },
        })) ?? [],
      dispose: () => {},
    };
  }
}
