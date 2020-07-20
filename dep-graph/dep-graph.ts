import { digraph, fs, open, toDot } from "../deps.ts";
import { htmlPage } from "./html-page.ts";
import { Configuration } from "../resource.ts";

export function depGraph(config: Configuration[]): void {
  const G = digraph("Execution tree", { rankdir: "LR" }, g => {
    for (const node of config) {
      g.node(node.resource.get(node));
      const dependant = node.resource.get(node);
      const dependency = node.dependsOn?.resource.get(node.dependsOn);
      if (dependency) {
        if (dependency !== "START") {
          g.edge([dependency, dependant]);
        }
      } else {
        console.error(
          `Missing 'dependsOn' property on '${node.resource.get(node)}'`
        );
      }
    }
  });
  const dot = toDot(G);
  const fileName = `/tmp/dsc-${new Date().getTime()}.html`;
  fs.writeFileStrSync(fileName, htmlPage(dot));
  open(fileName);
}
