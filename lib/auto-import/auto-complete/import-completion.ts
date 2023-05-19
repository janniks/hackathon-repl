import * as Monaco from "monaco-editor";

import ImportDb, { ImportObject } from "./import-db";
import { ImportFixer } from "./import-fixer";
import kindResolver from "./util/kind-resolution";

export const IMPORT_COMMAND = "resolveImport";

class ImportCompletion implements Monaco.languages.CompletionItemProvider {
  constructor(
    private editor: Monaco.editor.IStandaloneCodeEditor,
    private importDb: ImportDb
  ) {}

  /**
   * Handles a command sent by monaco, when the
   * suggestion has been selected
   */
  public handleCommand(imp: ImportObject, document: Monaco.editor.ITextModel) {
    new ImportFixer(this.editor).fix(document, imp);
  }

  public provideCompletionItems(document: Monaco.editor.ITextModel) {
    return {
      suggestions: this.importDb
        .all()
        .map((i) => this.buildCompletionItem(i, document)),
    };
  }

  private buildCompletionItem(
    imp: ImportObject,
    document: Monaco.editor.ITextModel
  ): Monaco.languages.CompletionItem {
    const path = this.createDescription(imp);

    return {
      label: imp.name,
      kind: kindResolver(imp),
      detail: `Auto import from '${path}'\n${imp.type} ${imp.name}`,
      additionalTextEdits: new ImportFixer(this.editor).editsSingle(
        document,
        imp
      ),
      range: undefined as unknown as Monaco.IRange,
      insertText: "",
    };
  }

  private createDescription({ file }: ImportObject) {
    return file.aliases?.[0] || file.path;
  }
}

export default ImportCompletion;
