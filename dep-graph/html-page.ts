export function htmlPage(dot: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>deno-dsc dependencies</title>
  <script src="https://cdn.jsdelivr.net/npm/viz.js@2.1.2/viz.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/viz.js@2.1.2/lite.render.js"></script>
</head>
<body>
<script>
  var viz = new Viz();
  console.log(\`${dot}\`);
  viz.renderSVGElement(\`${dot}\`)
  .then(function(element) {
    document.body.appendChild(element);
  })
</script>
</body>
</html>
`;
}
