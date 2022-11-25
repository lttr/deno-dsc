import { Config } from "../configuration.ts";
import { deno, digraph, open, toDot } from "../deps.ts";
import { GraphOptions } from "../graph.ts";
import { htmlPage } from "./html-page.ts";

export function depGraph(config: Config[], { filter }: GraphOptions): void {
  const G = digraph("Execution tree", { rankdir: "LR" }, (g) => {
    for (const node of config) {
      if (node.resource) {
        let description = node.resource.get(node);
        // HACK: replace colon in description (the rest of the string was stripped otherwise)
        description = description.replace(":", "<colon>");
        if (description.length > 100) {
          description = `${description.slice(0, 100)}...`;
        }
        let color = "darkgreen";
        if (isAbsent(node)) {
          color = "brown";
        }
        if (filter === node.resource.name) {
          color = "red";
        }
        g.node(description, {
          fontname: "Arial",
          fontsize: "12",
          color,
        });
        const dependency = node.dependsOn?.resource?.get(node.dependsOn);
        if (dependency) {
          if (dependency !== "START") {
            const dependant = description;
            g.edge([dependency, dependant]);
          }
        } else {
          console.error(`Missing 'dependsOn' property on '${description}'`);
        }
      }
    }
  });
  const dot = toDot(G);
  const fileName = `/tmp/dsc-${new Date().getTime()}.html`;
  deno.writeTextFileSync(fileName, htmlPage(dot));
  open(fileName);
}

function isAbsent(node: Config) {
  return node.ensure === "absent";
}
