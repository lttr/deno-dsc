import { digraph, toDot } from "https://deno.land/x/graphviz/mod.ts";

import { fs } from "../deps.ts";
import { htmlPage } from "./html-page.ts";
import { open } from "../deps.ts";

export async function depGraph(config: any): Promise<void> {
  const G = digraph("Execution tree", { rankdir: "LR" }, g => {
    for (const node of config) {
      g.node(node.resource.get(node));
      const dependant = node.resource.get(node);
      const dependency = node.dependsOn.resource.get(node.dependsOn);
      if (dependency !== "START") {
        g.edge([dependency, dependant]);
      }
    }
  });
  const dot = await toDot(G);
  const fileName = `/tmp/dsc-${new Date().getTime()}.html`;
  fs.writeFileStrSync(fileName, htmlPage(dot));
  open(fileName);
}
