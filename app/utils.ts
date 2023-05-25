import GENERATED from "../generated.json";
import * as monaco_editor from "monaco-editor";

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

export function getCustomTheme(): monaco_editor.editor.IStandaloneThemeData {
  const rules = [
    {
      token: "comment",
      fontStyle: "italic",
      foreground: "#7E7E8D",
    },
    {
      token: "punctuation.definition.comment",
      fontStyle: "italic",
      foreground: "#7E7E8D",
    },
    {
      token: "variable",
      foreground: "#D6D3D2",
    },
    {
      token: "string constant.other.placeholder",
      foreground: "#D6D3D2",
    },
    {
      token: "constant.other.color",
      foreground: "#ffffff",
    },
    {
      token: "invalid",
      foreground: "#FFA97E",
    },
    {
      token: "invalid.illegal",
      foreground: "#FFA97E",
    },
    {
      token: "keyword",
      foreground: "#B3D9FF",
    },
    {
      token: "storage.type",
      foreground: "#B3D9FF",
    },
    {
      token: "storage.modifier",
      foreground: "#B3D9FF",
    },
    {
      token: "keyword.control",
      foreground: "#B3D9FF",
    },
    {
      token: "constant.other.color",
      foreground: "#B3D9FF",
    },
    {
      token: "punctuation",
      foreground: "#B3D9FF",
    },
    {
      token: "meta.tag",
      foreground: "#B3D9FF",
    },
    {
      token: "punctuation.definition.tag",
      foreground: "#B3D9FF",
    },
    {
      token: "punctuation.separator.inheritance.php",
      foreground: "#B3D9FF",
    },
    {
      token: "punctuation.definition.tag.html",
      foreground: "#B3D9FF",
    },
    {
      token: "punctuation.definition.tag.begin.html",
      foreground: "#B3D9FF",
    },
    {
      token: "punctuation.definition.tag.end.html",
      foreground: "#B3D9FF",
    },
    {
      token: "punctuation.section.embedded",
      foreground: "#B3D9FF",
    },
    {
      token: "keyword.other.template",
      foreground: "#B3D9FF",
    },
    {
      token: "keyword.other.substitution",
      foreground: "#B3D9FF",
    },
    {
      token: "entity.name.tag",
      foreground: "#FFA97E",
    },
    {
      token: "meta.tag.sgml",
      foreground: "#FFA97E",
    },
    {
      token: "markup.deleted.git_gutter",
      foreground: "#FFA97E",
    },
    {
      token: "entity.name.function",
      foreground: "#87C3FF",
    },
    {
      token: "meta.function-call",
      foreground: "#87C3FF",
    },
    {
      token: "variable.function",
      foreground: "#87C3FF",
    },
    {
      token: "support.function",
      foreground: "#87C3FF",
    },
    {
      token: "keyword.other.special-method",
      foreground: "#87C3FF",
    },
    {
      token: "meta.block variable.other",
      foreground: "#D6D3D2",
    },
    {
      token: "support.other.variable",
      foreground: "#D6D3D2",
    },
    {
      token: "string.other.link",
      foreground: "#D6D3D2",
    },
    {
      token: "constant.language",
      foreground: "#FF9ECF",
    },
    {
      token: "support.constant",
      foreground: "#FF9ECF",
    },
    {
      token: "constant.character",
      foreground: "#FF9ECF",
    },
    {
      token: "constant.escape",
      foreground: "#FF9ECF",
    },
    {
      token: "keyword.other.unit",
      foreground: "#FF9ECF",
    },
    {
      token: "keyword.other",
      foreground: "#FF9ECF",
    },
    {
      token: "constant.numeric",
      foreground: "#FFA97E",
    },
    {
      token: "string",
      foreground: "#BAF2BD",
    },
    {
      token: "constant.other.symbol",
      foreground: "#BAF2BD",
    },
    {
      token: "constant.other.key",
      foreground: "#BAF2BD",
    },
    {
      token: "markup.heading",
      foreground: "#BAF2BD",
    },
    {
      token: "markup.inserted.git_gutter",
      foreground: "#BAF2BD",
    },
    {
      token:
        "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js",
      foreground: "#BAF2BD",
    },
    {
      token: "entity.name",
      foreground: "#F1BD76",
    },
    {
      token: "support.type",
      foreground: "#F1BD76",
    },
    {
      token: "support.class",
      foreground: "#F1BD76",
    },
    {
      token: "entity.other.inherited-class",
      foreground: "#F1BD76",
    },
    {
      token: "support.other.namespace.use.php",
      foreground: "#F1BD76",
    },
    {
      token: "meta.use.php",
      foreground: "#F1BD76",
    },
    {
      token: "support.other.namespace.php",
      foreground: "#F1BD76",
    },
    {
      token: "markup.changed.git_gutter",
      foreground: "#F1BD76",
    },
    {
      token: "support.type.sys-types",
      foreground: "#F1BD76",
    },
    {
      token: "support.type",
      foreground: "#B2CCD6",
    },
    {
      token: "source.css support.type.property-name",
      foreground: "#B2CCD6",
    },
    {
      token: "source.sass support.type.property-name",
      foreground: "#B2CCD6",
    },
    {
      token: "source.scss support.type.property-name",
      foreground: "#B2CCD6",
    },
    {
      token: "source.less support.type.property-name",
      foreground: "#B2CCD6",
    },
    {
      token: "source.stylus support.type.property-name",
      foreground: "#B2CCD6",
    },
    {
      token: "source.postcss support.type.property-name",
      foreground: "#B2CCD6",
    },
    {
      token: "entity.name.module.js",
      foreground: "#FFA97E",
    },
    {
      token: "variable.import.parameter.js",
      foreground: "#FFA97E",
    },
    {
      token: "variable.other.class.js",
      foreground: "#FFA97E",
    },
    {
      token: "variable.language",
      fontStyle: "italic",
      foreground: "#FFA97E",
    },
    {
      token: "entity.name.method.js",
      fontStyle: "italic",
      foreground: "#87C3FF",
    },
    {
      token: "meta.class-method.js entity.name.function.js",
      foreground: "#87C3FF",
    },
    {
      token: "variable.function.constructor",
      foreground: "#87C3FF",
    },
    {
      token: "entity.other.attribute-name",
      foreground: "#B3D9FF",
    },
    {
      token: "text.html.basic entity.other.attribute-name.html",
      fontStyle: "italic",
      foreground: "#F1BD76",
    },
    {
      token: "text.html.basic entity.other.attribute-name",
      fontStyle: "italic",
      foreground: "#F1BD76",
    },
    {
      token: "entity.other.attribute-name.class",
      foreground: "#F1BD76",
    },
    {
      token: "source.sass keyword.control",
      foreground: "#87C3FF",
    },
    {
      token: "markup.inserted",
      foreground: "#BAF2BD",
    },
    {
      token: "markup.deleted",
      foreground: "#FFA97E",
    },
    {
      token: "markup.changed",
      foreground: "#B3D9FF",
    },
    {
      token: "string.regexp",
      foreground: "#B3D9FF",
    },
    {
      token: "constant.character.escape",
      foreground: "#B3D9FF",
    },
    {
      token: "*url*",
      fontStyle: "underline",
    },
    {
      token: "*link*",
      fontStyle: "underline",
    },
    {
      token: "*uri*",
      fontStyle: "underline",
    },
    {
      token: "tag.decorator.js entity.name.tag.js",
      fontStyle: "italic",
      foreground: "#87C3FF",
    },
    {
      token: "tag.decorator.js punctuation.definition.tag.js",
      fontStyle: "italic",
      foreground: "#87C3FF",
    },
    {
      token: "source.js constant.other.object.key.js string.unquoted.label.js",
      fontStyle: "italic",
      foreground: "#FFA97E",
    },
    {
      token:
        "source.json meta.structure.dictionary.json support.type.property-name.json",
      foreground: "#B3D9FF",
    },
    {
      token:
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      foreground: "#F1BD76",
    },
    {
      token:
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      foreground: "#F78C6C",
    },
    {
      token:
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      foreground: "#FFA97E",
    },
    {
      token:
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      foreground: "#C17E70",
    },
    {
      token:
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      foreground: "#87C3FF",
    },
    {
      token:
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      foreground: "#FFA97E",
    },
    {
      token:
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      foreground: "#B3D9FF",
    },
    {
      token:
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
      foreground: "#BAF2BD",
    },
    {
      token: "text.html.markdown",
      foreground: "#EEFFFF",
    },
    {
      token: "punctuation.definition.list_item.markdown",
      foreground: "#EEFFFF",
    },
    {
      token: "text.html.markdown markup.inline.raw.markdown",
      foreground: "#B3D9FF",
    },
    {
      token:
        "text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown",
      foreground: "#65737E",
    },
    {
      token: "markdown.heading",
      foreground: "#BAF2BD",
    },
    {
      token: "markup.heading | markup.heading entity.name",
      foreground: "#BAF2BD",
    },
    {
      token: "markup.heading.markdown punctuation.definition.heading.markdown",
      foreground: "#BAF2BD",
    },
    {
      token: "markup.italic",
      fontStyle: "italic",
      foreground: "#FFA97E",
    },
    {
      token: "markup.bold",
      fontStyle: "bold",
      foreground: "#FFA97E",
    },
    {
      token: "markup.bold string",
      fontStyle: "bold",
      foreground: "#FFA97E",
    },
    {
      token: "markup.bold markup.italic",
      fontStyle: "bold",
      foreground: "#FFA97E",
    },
    {
      token: "markup.italic markup.bold",
      fontStyle: "bold",
      foreground: "#FFA97E",
    },
    {
      token: "markup.quote markup.bold",
      fontStyle: "bold",
      foreground: "#FFA97E",
    },
    {
      token: "markup.bold markup.italic string",
      fontStyle: "bold",
      foreground: "#FFA97E",
    },
    {
      token: "markup.italic markup.bold string",
      fontStyle: "bold",
      foreground: "#FFA97E",
    },
    {
      token: "markup.quote markup.bold string",
      fontStyle: "bold",
      foreground: "#FFA97E",
    },
    {
      token: "markup.underline",
      fontStyle: "underline",
      foreground: "#F78C6C",
    },
    {
      token: "markup.quote punctuation.definition.blockquote.markdown",
      foreground: "#65737E",
    },
    {
      token: "markup.quote",
      fontStyle: "italic",
    },
    {
      token: "string.other.link.title.markdown",
      foreground: "#87C3FF",
    },
    {
      token: "string.other.link.description.title.markdown",
      foreground: "#B3D9FF",
    },
    {
      token: "constant.other.reference.link.markdown",
      foreground: "#F1BD76",
    },
    {
      token: "markup.raw.block",
      foreground: "#B3D9FF",
    },
    {
      token: "markup.raw.block.fenced.markdown",
      foreground: "#00000050",
    },
    {
      token: "punctuation.definition.fenced.markdown",
      foreground: "#00000050",
    },
    {
      token: "markup.raw.block.fenced.markdown",
      foreground: "#EEFFFF",
    },
    {
      token: "variable.language.fenced.markdown",
      foreground: "#EEFFFF",
    },
    {
      token: "punctuation.section.class.end",
      foreground: "#EEFFFF",
    },
    {
      token: "variable.language.fenced.markdown",
      foreground: "#65737E",
    },
    {
      token: "meta.separator",
      fontStyle: "bold",
      foreground: "#65737E",
    },
    {
      token: "markup.table",
      foreground: "#EEFFFF",
    },
  ];
  return {
    base: "vs",
    colors: {
      "activityBar.activeBorder": "#80CBC4",
      "activityBar.background": "#17171A",
      "activityBar.border": "#00000060",
      "activityBar.foreground": "#A6ACCD",
      "activityBarBadge.background": "#B3D9FF",
      "activityBarBadge.foreground": "#000000",
      "badge.background": "#00000030",
      "badge.foreground": "#676E95",
      "breadcrumb.activeSelectionForeground": "#80CBC4",
      // "breadcrumb.background": "#232328",
      "breadcrumb.focusForeground": "#A6ACCD",
      "breadcrumb.foreground": "#7E7E8D",
      "breadcrumbPicker.background": "#17171A",
      "button.background": "#717CB450",
      "button.foreground": "#ffffff",
      "debugConsole.errorForeground": "#FF9ECF",
      "debugConsole.infoForeground": "#B3D9FF",
      "debugConsole.warningForeground": "#F1BD76",
      "debugToolBar.background": "#232328",
      "diffEditor.insertedTextBackground": "#B3D9FF20",
      "diffEditor.removedTextBackground": "#ff9cac20",
      "dropdown.background": "#232328",
      "dropdown.border": "#FFFFFF10",
      "editor.background": "#232328",
      "editor.findMatchBackground": "#000000",
      "editor.findMatchBorder": "#80CBC4",
      "editor.findMatchHighlightBackground": "#00000050",
      "editor.findMatchHighlightBorder": "#ffffff50",
      "editor.findRangeHighlightBackground": "#F1BD7630",
      "editor.foreground": "#D6D3D2",
      "editor.lineHighlightBackground": "#00000050",
      "editor.lineHighlightBorder": "#00000000",
      "editor.rangeHighlightBackground": "#FFFFFF0d",
      "editor.selectionBackground": "#717CB450",
      "editor.selectionHighlightBackground": "#FFCC0020",
      "editor.wordHighlightBackground": "#ff9cac30",
      "editor.wordHighlightStrongBackground": "#BAF2BD30",
      "editorBracketMatch.background": "#232328",
      "editorBracketMatch.border": "#FFCC0050",
      "editorCursor.foreground": "#F1BD76",
      "editorError.foreground": "#FF698AAA",
      "editorGroup.border": "#00000030",
      "editorGroup.dropBackground": "#FF9ECF80",
      "editorGroup.focusedEmptyBorder": "#FF9ECF",
      "editorGroupHeader.tabsBackground": "#17171A",
      "editorGutter.addedBackground": "#BAF2BD60",
      "editorGutter.deletedBackground": "#FF9ECF60",
      "editorGutter.modifiedBackground": "#82AAFF60",
      "editorHoverWidget.background": "#232328",
      "editorHoverWidget.border": "#FFFFFF10",
      "editorIndentGuide.activeBackground": "#4E5579",
      "editorIndentGuide.background": "#4E557970",
      "editorInfo.foreground": "#B3D9FFAA",
      "editorLineNumber.activeForeground": "#7D7D8C",
      "editorLineNumber.foreground": "#45454E",
      "editorLink.activeForeground": "#A6ACCD",
      "editorMarkerNavigation.background": "#A6ACCD05",
      "editorOverviewRuler.border": "#232328",
      "editorOverviewRuler.errorForeground": "#FF9ECF40",
      "editorOverviewRuler.findMatchForeground": "#80CBC4",
      "editorOverviewRuler.infoForeground": "#82AAFF40",
      "editorOverviewRuler.warningForeground": "#F1BD7640",
      "editorRuler.foreground": "#4E5579",
      "editorSuggestWidget.background": "#232328",
      "editorSuggestWidget.border": "#FFFFFF10",
      "editorSuggestWidget.foreground": "#A6ACCD",
      "editorSuggestWidget.highlightForeground": "#80CBC4",
      "editorSuggestWidget.selectedBackground": "#00000050",
      "editorWarning.foreground": "#FFA97EAA",
      "editorWhitespace.foreground": "#A6ACCD40",
      "editorWidget.background": "#17171A",
      "editorWidget.border": "#80CBC4",
      "editorWidget.resizeBorder": "#80CBC4",
      "extensionBadge.remoteForeground": "#A6ACCD",
      "extensionButton.prominentBackground": "#BAF2BD90",
      "extensionButton.prominentForeground": "#000000",
      "extensionButton.prominentHoverBackground": "#BAF2BD",
      focusBorder: "#FFFFFF00",
      foreground: "#A6ACCD",
      "gitDecoration.conflictingResourceForeground": "#F1BD7690",
      "gitDecoration.deletedResourceForeground": "#FF9ECF90",
      "gitDecoration.ignoredResourceForeground": "#7E7E8D90",
      "gitDecoration.modifiedResourceForeground": "#82AAFF90",
      "gitDecoration.untrackedResourceForeground": "#BAF2BD90",
      "input.background": "#333747",
      "input.border": "#FFFFFF10",
      "input.foreground": "#A6ACCD",
      "input.placeholderForeground": "#A6ACCD60",
      "inputOption.activeBackground": "#A6ACCD30",
      "inputOption.activeBorder": "#A6ACCD30",
      "inputValidation.errorBorder": "#FF9ECF",
      "inputValidation.infoBorder": "#82AAFF",
      "inputValidation.warningBorder": "#F1BD76",
      "list.activeSelectionBackground": "#17171A",
      "list.activeSelectionForeground": "#80CBC4",
      "list.dropBackground": "#FF9ECF80",
      "list.focusBackground": "#A6ACCD20",
      "list.focusForeground": "#A6ACCD",
      "list.highlightForeground": "#80CBC4",
      "list.hoverBackground": "#17171AAA",
      "list.hoverForeground": "#FFFFFF",
      "list.inactiveSelectionBackground": "#00000030",
      "list.inactiveSelectionForeground": "#80CBC4",
      "listFilterWidget.background": "#00000030",
      "listFilterWidget.noMatchesOutline": "#00000030",
      "listFilterWidget.outline": "#00000030",
      "menu.background": "#232328",
      "menu.foreground": "#A6ACCD",
      "menu.selectionBackground": "#00000050",
      "menu.selectionBorder": "#00000030",
      "menu.selectionForeground": "#80CBC4",
      "menu.separatorBackground": "#A6ACCD",
      "menubar.selectionBackground": "#00000030",
      "menubar.selectionBorder": "#00000030",
      "menubar.selectionForeground": "#80CBC4",
      "notebook.focusedCellBorder": "#80CBC4",
      "notebook.inactiveFocusedCellBorder": "#80CBC450",
      "notificationLink.foreground": "#80CBC4",
      "notifications.background": "#232328",
      "notifications.foreground": "#A6ACCD",
      "panel.background": "#17171A",
      "panel.border": "#00000060",
      "panelTitle.activeBorder": "#80CBC400",
      "panelTitle.activeForeground": "#FFFFFF",
      "panelTitle.inactiveForeground": "#A6ACCD",
      "peekView.border": "#00000030",
      "peekViewEditor.background": "#A6ACCD05",
      "peekViewEditor.matchHighlightBackground": "#717CB450",
      "peekViewEditorGutter.background": "#A6ACCD05",
      "peekViewResult.background": "#A6ACCD05",
      "peekViewResult.matchHighlightBackground": "#717CB450",
      "peekViewResult.selectionBackground": "#7E7E8D70",
      "peekViewTitle.background": "#A6ACCD05",
      "peekViewTitleDescription.foreground": "#A6ACCD60",
      "pickerGroup.border": "#FFFFFF1a",
      "pickerGroup.foreground": "#80CBC4",
      "progressBar.background": "#80CBC4",
      "quickInput.background": "#232328",
      "quickInput.foreground": "#7E7E8D",
      "scrollbar.shadow": "#00000030",
      "scrollbarSlider.activeBackground": "#80CBC4",
      "scrollbarSlider.background": "#A6ACCD20",
      "scrollbarSlider.hoverBackground": "#A6ACCD10",
      "selection.background": "#00000080",
      "settings.checkboxBackground": "#17171A",
      "settings.checkboxForeground": "#A6ACCD",
      "settings.dropdownBackground": "#17171A",
      "settings.dropdownForeground": "#A6ACCD",
      "settings.headerForeground": "#80CBC4",
      "settings.modifiedItemIndicator": "#80CBC4",
      "settings.numberInputBackground": "#17171A",
      "settings.numberInputForeground": "#A6ACCD",
      "settings.textInputBackground": "#17171A",
      "settings.textInputForeground": "#A6ACCD",
      "sideBar.background": "#17171A",
      "sideBar.border": "#00000060",
      "sideBar.foreground": "#7E7E8D",
      "sideBarSectionHeader.background": "#17171A",
      "sideBarSectionHeader.border": "#00000060",
      "sideBarTitle.foreground": "#bbbbbb",
      "statusBar.background": "#17171A",
      "statusBar.border": "#00000060",
      "statusBar.debuggingBackground": "#B3D9FF",
      "statusBar.debuggingForeground": "#ffffff",
      "statusBar.foreground": "#676E95",
      "statusBar.noFolderBackground": "#17171A",
      "statusBarItem.activeBackground": "#FF9ECF80",
      "statusBarItem.hoverBackground": "#676E9520",
      "statusBarItem.remoteBackground": "#17171A",
      "statusBarItem.remoteForeground": "#000000",
      "tab.activeBackground": "#232328",
      // "tab.activeBorder": "#80CBC4",
      "tab.activeForeground": "#FFFFFF",
      "tab.activeModifiedBorder": "#7E7E8D",
      "tab.border": "#0c0c0e",
      "tab.inactiveBackground": "#17171A",
      "tab.inactiveForeground": "#7E7E8D",
      // "tab.inactiveBackground": "#00000030",
      // "tab.inactiveModifiedBorder": "#904348",
      // "tab.unfocusedActiveBorder": "#676E95",
      "tab.unfocusedActiveForeground": "#A6ACCD",
      // "tab.unfocusedActiveModifiedBorder": "#c05a60",
      // "tab.unfocusedInactiveModifiedBorder": "#904348",

      "terminal.ansiBlack": "#000000",
      "terminal.ansiBlue": "#82AAFF",
      "terminal.ansiBrightBlack": "#676E95",
      "terminal.ansiBrightBlue": "#82AAFF",
      "terminal.ansiBrightCyan": "#B3D9FF",
      "terminal.ansiBrightGreen": "#BAF2BD",
      "terminal.ansiBrightMagenta": "#C792EA",
      "terminal.ansiBrightRed": "#FF9ECF",
      "terminal.ansiBrightWhite": "#ffffff",
      "terminal.ansiBrightYellow": "#F1BD76",
      "terminal.ansiCyan": "#B3D9FF",
      "terminal.ansiGreen": "#BAF2BD",
      "terminal.ansiMagenta": "#C792EA",
      "terminal.ansiRed": "#FF9ECF",
      "terminal.ansiWhite": "#ffffff",
      "terminal.ansiYellow": "#F1BD76",
      "terminalCursor.background": "#000000",
      "terminalCursor.foreground": "#F1BD76",
      "textLink.activeForeground": "#A6ACCD",
      "textLink.foreground": "#80CBC4",
      "titleBar.activeBackground": "#17171A",
      "titleBar.activeForeground": "#A6ACCD",
      "titleBar.border": "#00000060",
      "titleBar.inactiveBackground": "#17171A",
      "titleBar.inactiveForeground": "#7E7E8D",
      "tree.indentGuidesStroke": "#4E5579",
      "widget.shadow": "#00000030",
    },
    inherit: true,
    rules,
  };
}
