import { digraph, fs, open, toDot } from "../deps.ts";
import { htmlPage } from "./html-page.ts";
import { Config } from "../configuration.ts";

export function depGraph(config: Config[]): void {
  const G = digraph("Execution tree", { rankdir: "LR" }, g => {
    for (const node of config) {
      if (node.resource) {
        g.node(node.resource.get(node), {
          fontname: "Arial",
          fontsize: "12",
          color: isAbsent(node) ? "brown" : "darkgreen"
        });
        const dependency = node.dependsOn?.resource?.get(node.dependsOn);
        if (dependency) {
          if (dependency !== "START") {
            const dependant = node.resource.get(node);
            g.edge([dependency, dependant]);
          }
        } else {
          console.error(
            `Missing 'dependsOn' property on '${node.resource.get(node)}'`
          );
        }
      }
    }
  });
  const dot = toDot(G);
  const fileName = `/tmp/dsc-${new Date().getTime()}.html`;
  fs.writeFileStrSync(fileName, htmlPage(dot));
  open(fileName);
}

function isAbsent(node: Config) {
  return node.ensure === "absent";
}
