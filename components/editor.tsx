"use client";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco_editor from "monaco-editor";

import { regexTokeniser } from "../lib/auto-import";
import AutoImport from "../lib/auto-import/auto-complete";
import { fetchDeps, fetchSnippet } from "@/app/utils";
import RunButton from "./run-button";
import Button from "./button";

import GENERATED from "../generated.json";
import { useHotkeys } from "react-hotkeys-hook";

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
  const [editor, setEditor] =
    useState<monaco_editor.editor.IStandaloneCodeEditor>();

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
        defaultValue={code}
        beforeMount={beforeMount}
        onMount={onMount}
        onChange={onChange}
      />
      <div className="flex justify-between my-3">
        {editor ? (
          <RunButton editor={editor} />
        ) : (
          <Button text="Run" disabled={true}></Button>
        )}
        <Button
          onclick={async () => {
            await setSnippet("test");
          }}
          text={"Get Test Snippet"}
        ></Button>
        <div className="flex justify-center text-gray-600 cursor-default">
          <div className="flex items-center justify-center pr-0.5 w-[31px] h-[25px] border shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]  rounded-lg border-gray-400 text-gray-500 bg-gray-200">
            ⌘
          </div>
          <div className="mx-0.5">+</div>
          <div className="flex items-center justify-center w-[31px] h-[25px] border shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]  rounded-lg border-gray-400 text-gray-500 bg-gray-200 text-[12px]">
            ⏎
          </div>
        </div>
      </div>
      <div id="console-container"></div>
    </div>
  );
};

export default WrappedEditor;
