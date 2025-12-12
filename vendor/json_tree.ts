// Vendored from https://github.com/satty1987/json_tree

function makePrefix(key: string, last: boolean): string {
  let str = last ? "└" : "├";
  if (key) {
    str += "─ ";
  } else {
    str += "──┐";
  }
  return str;
}

function filterKeys(
  obj: Record<string, unknown>,
  hideFunctions: boolean,
): string[] {
  const keys: string[] = [];
  for (const branch in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, branch)) {
      continue;
    }
    if (hideFunctions && typeof obj[branch] === "function") {
      continue;
    }
    keys.push(branch);
  }
  return keys;
}

function growBranch(
  key: string,
  root: unknown,
  last: boolean,
  lastStates: [unknown, boolean][],
  showValues: boolean,
  hideFunctions: boolean,
  callback: (line: string) => void,
): void {
  let line = "";
  let index = 0;
  let lastKey: boolean;
  let circular = false;
  const lastStatesCopy = lastStates.slice(0);

  if (lastStatesCopy.push([root, last]) && lastStates.length > 0) {
    lastStates.forEach(function (lastState, idx) {
      if (idx > 0) {
        line += (lastState[1] ? " " : "│") + "  ";
      }
      if (!circular && lastState[0] === root) {
        circular = true;
      }
    });
    line += makePrefix(key, last) + key;
    if (showValues && (typeof root !== "object" || root instanceof Date)) {
      line += ": " + root;
    }
    if (circular) {
      line += " (circular ref.)";
    }

    callback(line);
  }

  if (!circular && typeof root === "object" && root !== null) {
    const keys = filterKeys(root as Record<string, unknown>, hideFunctions);
    keys.forEach(function (branch) {
      lastKey = ++index === keys.length;
      growBranch(
        branch,
        (root as Record<string, unknown>)[branch],
        lastKey,
        lastStatesCopy,
        showValues,
        hideFunctions,
        callback,
      );
    });
  }
}

export function jsonTree(
  obj: unknown,
  showValues: boolean,
  hideFunctions?: boolean,
): string {
  let tree = "";
  growBranch(".", obj, false, [], showValues, hideFunctions ?? false, function (
    line,
  ) {
    tree += line + "\n";
  });
  return tree;
}
