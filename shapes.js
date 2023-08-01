function generateShapes() {
  var svgns = "http://www.w3.org/2000/svg";
  var xlinkns = "http://www.w3.org/1999/xlink";

  var shapes = ["triangle", "semicircle", "spring", "line"];

  var pixelsPerShape = 116;
  var numShapes = Math.floor((window.innerWidth * window.innerHeight) / Math.pow(pixelsPerShape, 2));

  for (var i = 0; i < numShapes; i++) {
    var svg = document.createElementNS(svgns, "svg");
    svg.style.height = "28px";
    svg.style.left = Math.random() * 100 + "%";
    svg.style.opacity = 0.25;
    svg.style.position = "absolute";
    svg.style.top = Math.random() * 100 + "%";
    svg.style.transform = "rotate(" + Math.random() * 360 + "deg)";
    svg.style.width = "28px";

    var use = document.createElementNS(svgns, "use");
    use.setAttributeNS(xlinkns, "href", "#" + rand(shapes));

    svg.appendChild(use);
    document.getElementsByClassName("shapes")[0].appendChild(svg);
  }
}

function rand(array) {
  return array[Math.floor(Math.random() * array.length)];
}

generateShapes();
