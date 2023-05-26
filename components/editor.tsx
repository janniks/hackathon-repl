import { fetchDeps, getCustomTheme } from "@/lib/utils";
import Editor from "@monaco-editor/react";
import { useAtom } from "jotai";
import * as monaco_editor from "monaco-editor";

import { editorAtom } from "../lib/atoms";
import { regexTokeniser } from "../lib/auto-import";
import AutoImport from "../lib/auto-import/auto-complete";

const WrappedEditor = ({
  code,
  onChange,
}: {
  code: string;
  onChange: (
    value: string | undefined,
    ev: monaco_editor.editor.IModelContentChangedEvent
  ) => void;
}) => {
  const [editor, setEditor] = useAtom(editorAtom);

  if (typeof window === "undefined") return null;

  async function beforeMount(monaco: typeof monaco_editor) {
    if (editor) return;

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
    });

    monaco.editor.defineTheme("hiroic", getCustomTheme());
    monaco.editor.setTheme("hiroic");

    const deps = await fetchDeps();
    for (const dep of deps) {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `declare module '${dep.pkgName}' { ${dep.code} }`,
        `file://${dep.path}`
      );
    }
  }

  async function onMount(
    mountedEditor: monaco_editor.editor.IStandaloneCodeEditor,
    monaco: typeof monaco_editor
  ) {
    if (editor) return;
    const deps = await fetchDeps();
    const files = deps.map((dep) => ({
      path: dep.path,
      aliases: [dep.pkgName],
      imports: regexTokeniser(dep.code),
    }));
    const completor = new AutoImport({ monaco, editor: mountedEditor });
    completor.imports.saveFiles(files);
    setEditor(mountedEditor);
  }

  return (
    <div id="editor-container">
      <Editor
        theme="hiroic"
        height="500px"
        defaultLanguage="typescript"
        defaultValue={code}
        beforeMount={beforeMount}
        onMount={onMount}
        onChange={onChange}
        options={{
          scrollBeyondLastLine: false,
          //scrollbar: { alwaysConsumeMouseWheel: false },
          padding: { bottom: 24 },
        }}
      />
    </div>
  );
};

export default WrappedEditor;
