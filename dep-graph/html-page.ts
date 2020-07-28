export function htmlPage(dot: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>deno-dsc dependencies</title>
  <script src="https://cdn.jsdelivr.net/npm/viz.js@2.1.2/viz.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/viz.js@2.1.2/lite.render.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
  <style>
    body {
      display: grid;
      place-content: center;
      height: 100vh;
      padding: 0;
      margin: 0;
      background: lightgrey;
    }
    #wrapper {
      width: calc(100vw - 50px);
      height: calc(100vh - 50px);
      overflow: hidden;
      background: white;
    }
  </style>
</head>
<body>
<div id="wrapper"></div>
<script>
  var viz = new Viz();
  console.log(\`${dot}\`);
  viz.renderSVGElement(\`${dot}\`)
  .then(function(element) {
    const wrapper = document.getElementById('wrapper')
    wrapper.appendChild(element);
    element.setAttribute('width', wrapper.clientWidth)
    element.setAttribute('height', wrapper.clientHeight)

    function beforePan(oldPan, newPan){
      var stopHorizontal = false
        , stopVertical = false
        , gutterWidth = 100
        , gutterHeight = 100
          // Computed variables
        , sizes = this.getSizes()
        , leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth
        , rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom)
        , topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight
        , bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom)
      customPan = {}
      customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
      customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y))
      return customPan
    }
    const panZoom = svgPanZoom('#wrapper svg', {
     panEnabled: true
    , controlIconsEnabled: true
    , zoomEnabled: true
    , dblClickZoomEnabled: true
    , mouseWheelZoomEnabled: true
    , preventMouseEventsDefault: true
    , zoomScaleSensitivity: 0.2
    , minZoom: 0.5
    , maxZoom: 15
    , fit: true
    , center: true
    , beforePan
    });
  })
</script>
</body>
</html>
`;
}
