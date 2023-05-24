"use client";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco_editor from "monaco-editor";

import { regexTokeniser } from "../lib/auto-import";
import AutoImport from "../lib/auto-import/auto-complete";
import { fetchDeps, fetchSnippet } from "@/app/utils";



const WrappedEditor = ({ code }: { code: string }) => {
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

  async function runit() {
    const code = editor?.getValue();
    const script = document.createElement("script");

    const consoleCode = `
      function escapeHtml(unsafe) {
        return unsafe
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }
      const oldConsole = console;
      console = {log: (...args) => {
        const parent = document.createElement("div");
        parent.innerHTML = args.map((arg) => {
          if (arg instanceof Error) {
            return (
              "<pre style='white-space:pre-wrap'>" +
              escapeHtml(
                JSON.stringify(
                  { ...arg, message: arg.message, stack: arg.stack },
                  null,
                  2
                )
              ) +
              "</pre>"
            );
          } else if (typeof arg === "object") {
            try {
              return (
                "<pre style='white-space:pre-wrap'>" +
                escapeHtml(
                  JSON.stringify(
                    arg,
                    (key, value) => {
                        return typeof value === 'bigint'
                                    ? value.toString()
                                    : value;
                    },
                  2)
                ) +
                "</pre>"
              );
            } catch {
              return escapeHtml(arg);
            }
          } else if (typeof arg === "string") {
            return (
              "<pre style='white-space:pre-wrap'>" +
              escapeHtml(arg) +
              "</pre>"
            );
          } else {
            return arg;//escapeHtml("" + arg);
          }
        }).join(" ");
        document
          .getElementById("editor-container")
          .appendChild(parent);
      }};
      ${code}
      console = oldConsole;
    `;
    script.innerHTML = consoleCode;
    script.setAttribute("type", "module");

    document.head.appendChild(script);
  }

  // async function fetchSnippet(snippetName: string) {
  //   const cache = await caches.open("snippets");
  //   const req = new Request(`/snippets/${snippetName}.js`);
  //   const snippet = await fetchOrGetFromCache(cache, req);
  //   editor?.setValue(snippet);
  // }

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
      />
      <button onClick={runit}>Run It</button>
      {/* <button
        onClick={() => {
          fetchSnippet("test");
        }}
      >
        Get Test Snippet
      </button> */}
    </div>
  );
};

const fetchOrGetFromCache = async (cache: Cache, req: Request) => {
  const cachedRes = await cache.match(req);
  if (cachedRes) {
    return cachedRes.clone().text();
  }
  const fetchRes = await fetch(req);
  if (fetchRes.ok) {
    if (!req.url.includes("localhost")) {
      await cache.put(req, fetchRes.clone());
    }
    return fetchRes.clone().text();
  }
  throw new Error(`Unable to fetch: ${req.url}`);
};

// Some methods adapted from qwik https://github.com/BuilderIO/qwik
// MIT License Copyright (c) 2021 BuilderIO
const fetchDep = async (cache: Cache, dep: NodeModuleDep) => {
  const url = getCdnUrl(dep.pkgName, dep.pkgVersion, dep.pkgPath);
  const req = new Request(url);
  return await fetchOrGetFromCache(cache, req);
};

const getCdnUrl = (pkgName: string, pkgVersion: string, pkgPath: string) => {
  return `https://cdn.jsdelivr.net/npm/${pkgName}@${pkgVersion}${pkgPath}`;
};

interface NodeModuleDep {
  pkgName: string;
  pkgPath: string;
  pkgVersion: string;
  path: string;
  code?: string;
  promise?: Promise<void>;
}

export default WrappedEditor;
