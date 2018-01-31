'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { workspace } from 'vscode';

import { reformat } from 'reformat-markdown-table';
import * as escapeStringRegexp from 'escape-string-regexp'


// let config = workspace.getConfiguration('elasticTabstopsWitSpaces');
// let enable: boolean = config.get<boolean>('enable', true);

// workspace.onDidChangeConfiguration(e => {
//   config = workspace.getConfiguration('elasticTabstopsWitSpaces');
//   enable = config.get<boolean>('enable', true);
// });

const CONTINUOUS_BLOCKS_WITH_TABS_REGEX = /(?:.*\t.*\r?\n)+/g;

function extractBlocks(text: string): string[] {
  return text.match(CONTINUOUS_BLOCKS_WITH_TABS_REGEX);
}

export function activate(context: vscode.ExtensionContext) {

  let formatCommand = vscode.commands.registerTextEditorCommand('elastic.tabstops.formatWithSpaces', (editor, edit) => {
    let startTime = new Date().getTime();

    const start = new vscode.Position(0, 0);
    const end = new vscode.Position(editor.document.lineCount - 1, editor.document.lineAt(editor.document.lineCount - 1).text.length);
    const range = new vscode.Range(start, end);

    let text = editor.document.getText(range)

    const blocks = extractBlocks(text);
    if (blocks) {
      blocks.forEach((block) => {
        var re = new RegExp(escapeStringRegexp(String(block)), 'g')
        text = text.replace(re, (substring: string) => reformat(block, '\t'))
      });
    }
    edit.replace(range, text);

    let elasped = new Date().getTime() - startTime;
    console.log("Table: Formatting succeeded! time: " + elasped + "ms");
  });

  context.subscriptions.push(formatCommand);

}

export function deactivate() { }
