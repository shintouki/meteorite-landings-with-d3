d3.json("https://raw.githubusercontent.com/shintouki/uploaded-files/master/world-50m.json", function(error, topology) {

  let width = window.innerWidth;
  let height = window.innerHeight;
  let projectionScale = height / 4; 
  let centerY = height / 25;
  let shiftRight = 400;

  let projection = d3.geo.mercator()
      .center([0, centerY])
      .scale(projectionScale);
  
  let svg = d3.select(".mapDiv").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.behavior.zoom()
            .on("zoom", function () {
              svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            })
        )
        .append("g");

  let path = d3.geo.path()
      .projection(projection);

  let map = svg.append("g")
    .selectAll("path")
      .data(topojson.object(topology, topology.objects.countries).geometries)
    .enter()
      .append("path")
      .attr("d", path)
      .attr("transform", "translate(" + shiftRight + ", 0)");

  // Div for tooltip box
  let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("opacity", 0);

    d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json", function(error, data) {

      var radius = d3.scale.sqrt()
          .domain([0, d3.max(data.features, function(d) { return d.properties.mass })])
          .range([0, 2]);

      let bubbles = svg.append("g")
          .attr("class", "bubble")
        .selectAll("circle")
          .data(data.features)
        .enter()
          .append("circle")
          .attr("transform", function (d) {
            if (d.geometry == null) return;
            let pathCentroid = path.centroid(d);
            pathCentroid[0] += shiftRight;
            return "translate(" + pathCentroid + ")";
          })
          .attr("r", function (d) {
            return radius(d.properties.mass) / 10;
          })
          .on("mouseover", function(d) {
            // Tooltip
            let name = d.properties.name;
            let mass = d.properties.mass;
            let year = d.properties.year;
            let reclat = d.properties.reclat;
            let reclong = d.properties.reclong;
            let recclass = d.properties.recclass;

            tooltip.transition()
              .duration(200)
              .style("opacity", 0.9);
            tooltip.html("Name: " + name + "<br/>" + "Mass: " + mass + "<br/>" +
                         "Year: " + year + "<br/>" + "Lat: " + reclat + "<br/>" + 
                         "Long: " + reclong + "<br/>" + "Class: " + recclass)
              .style("left", (d3.event.pageX + 10) + "px")
              .style("top", (d3.event.pageY - 70) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          });

    });
  
});

// References
// http://bl.ocks.org/d3noob/5189284