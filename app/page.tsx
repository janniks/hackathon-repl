"use client";

import Editor from "@monaco-editor/react";
import * as monaco_editor from "monaco-editor";

import { regexTokeniser } from "../lib/auto-import";
import AutoImport from "../lib/auto-import/auto-complete";

const STACKS_JS_VERSION = "6.5.2";

const packages = [
  {
    name: "@stacks/common",
    files: [
      "/dist/constants.d.ts",
      "/dist/buffer.d.ts",
      "/dist/errors.d.ts",
      "/dist/config.d.ts",
      "/dist/signatures.d.ts",
      "/dist/keys.d.ts",
      "/dist/utils.d.ts",
      "/dist/logger.d.ts",
      "/dist/index.d.ts",
    ],
  },
];

const deps: NodeModuleDep[] = packages.flatMap((pkg) =>
  pkg.files.map((path) => ({
    pkgName: pkg.name,
    pkgVersion: STACKS_JS_VERSION,
    pkgPath: path,
    path: `/node_modules/${pkg.name}${path}`,
  }))
);

async function beforeMount(monaco: typeof monaco_editor) {
  const cache = await caches.open("repl");

  const fetched = await Promise.all([
    ...deps.map(async (dep) => {
      const code = await fetchDep(cache, dep);
      return { ...dep, code };
    }),
  ]);

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    typeRoots: ["node_modules/@types"],
  });

  for (const dep of fetched) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module '${dep.pkgName}' { ${dep.code} }`,
      `file://${dep.path}`
    );
    console.log("Monaco: addExtraLib ", dep.path, dep.code);
  }
}

async function onMount(
  editor: monaco_editor.editor.IStandaloneCodeEditor,
  monaco: typeof monaco_editor
) {
  const cache = await caches.open("repl");

  const fetched = await Promise.all([
    ...deps.map(async (dep) => {
      const code = await fetchDep(cache, dep);
      return { ...dep, code };
    }),
  ]);
  const files = fetched.map((dep) => ({
    path: dep.path,
    aliases: [dep.pkgName],
    imports: regexTokeniser(dep.code),
  }));
  const completor = new AutoImport({ monaco, editor });
  completor.imports.saveFiles(files);
}

export default function Home() {
  return (
    <div>
      <Editor
        height="100vh"
        defaultLanguage="typescript"
        defaultValue="// some comment"
        beforeMount={beforeMount}
        onMount={onMount}
      />
    </div>
  );
}
// Some methods adapted from qwik https://github.com/BuilderIO/qwik
// MIT License Copyright (c) 2021 BuilderIO

const fetchDep = async (cache: Cache, dep: NodeModuleDep) => {
  const url = getCdnUrl(dep.pkgName, dep.pkgVersion, dep.pkgPath);
  const req = new Request(url);
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
  throw new Error(`Unable to fetch: ${url}`);
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
