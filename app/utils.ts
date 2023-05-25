import GENERATED from "../generated.json";

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

interface NodeModuleDep {
  pkgName: string;
  pkgPath: string;
  pkgVersion: string;
  path: string;
  code?: string;
  promise?: Promise<void>;
}
const deps: NodeModuleDep[] = GENERATED.flatMap((pkg) =>
  pkg.files.map((path) => ({
    pkgName: pkg.name,
    pkgVersion: pkg.version,
    pkgPath: path,
    path: `/node_modules/${pkg.name}${path}`,
  }))
);
// Some methods adapted from qwik https://github.com/BuilderIO/qwik
// MIT License Copyright (c) 2021 BuilderIO
const fetchDep = async (cache: Cache, dep: NodeModuleDep) => {
  const url = getCdnUrl(dep.pkgName, dep.pkgVersion, dep.pkgPath);
  const req = new Request(url);
  return await fetchOrGetFromCache(cache, req);
};

export const fetchDeps = async () => {
  const cache = await caches.open("repl");
  interface NodeModuleDep {
    pkgName: string;
    pkgPath: string;
    pkgVersion: string;
    path: string;
    code?: string;
    promise?: Promise<void>;
  }
  const deps: NodeModuleDep[] = GENERATED.flatMap((pkg) =>
    pkg.files.map((path) => ({
      pkgName: pkg.name,
      pkgVersion: pkg.version,
      pkgPath: path,
      path: `/node_modules/${pkg.name}${path}`,
    }))
  );
  const fetched = await Promise.all([
    ...deps.map(async (dep) => {
      const code = await fetchDep(cache, dep);
      return { ...dep, code };
    }),
  ]);
  return fetched;
};

const getCdnUrl = (pkgName: string, pkgVersion: string, pkgPath: string) => {
  return `https://cdn.jsdelivr.net/npm/${pkgName}@${pkgVersion}${pkgPath}`;
};

export async function fetchSnippetMetadata(snippetName: string) {
  const cache = await caches.open("snippets");
  const req = new Request(`/snippets/${snippetName}.json`);
  return await fetchOrGetFromCache(cache, req);
}
