"use client";
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco_editor from "monaco-editor";

import { regexTokeniser } from "../lib/auto-import";
import AutoImport from "../lib/auto-import/auto-complete";
import { fetchDeps, fetchSnippet } from "@/app/utils";
import RunButton from "./run-button";
import Button from "./button";



const WrappedEditor = ({ defaultCode }: { defaultCode: string }) => {
  const [editor, setEditor] =
    useState<monaco_editor.editor.IStandaloneCodeEditor>();
  const [code, setCode] = useState<string>();

  useEffect(() => {
    editor?.setValue(code || defaultCode)
  }, [code, editor, defaultCode]);

  async function beforeMount(monaco: typeof monaco_editor) {

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
    });

    const deps = await fetchDeps();
    for (const dep of deps) {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `declare module '${dep.pkgName}' { ${dep.code} }`,
        `file://${dep.path}`
      );
    }

    setCode(await fetchSnippet("default"));
  }

  async function onMount(
    mountedEditor: monaco_editor.editor.IStandaloneCodeEditor,
    monaco: typeof monaco_editor
  ) {

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


  async function setSnippet(snippetName: string) {
    const snippet = await fetchSnippet(snippetName);
    editor?.setValue(snippet);

  }

  const editorContainer = {
    width: "80%",
    margin: "auto",
    paddingTop: "10em",
  };
  return (
    <div style={editorContainer} id="editor-container">
      <Editor
        theme="vs-dark"
        height="500px"
        defaultLanguage="typescript"
        defaultValue={code || defaultCode}
        beforeMount={beforeMount}
        onMount={onMount}
      />
      {editor ? <RunButton editor={editor} /> : <Button text="Run" disabled={true}></Button>}
      <Button onclick={async ()=> {await setSnippet("test")}} text={"Get Test Snippet"}></Button>
    </div>
  );
};

export default WrappedEditor;
