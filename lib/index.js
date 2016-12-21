require('./resources/index.css');

const d3 = require('d3');
require('d3-force');


const problem = require('./resources/problem.json');
const solution = require('./resources/solution.json');

const height = window.innerHeight;
const width = window.innerWidth;

const svg = d3.select("#container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))
        .append("g")

const simulation = d3.forceSimulation()
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink()
        .id(function(d) { return d.id; })
        .distance( function(d) {
            return d.distance *10;
        })
        .strength(2)
        )
    // .force("charge", d3.forceManyBody())

const color = d3.scaleOrdinal(d3.schemeCategory20);

const links = [];

for( let value of problem.edges ) {
    let obj ={
        source: value.departure_vertice_id,
        target: value.arrival_vertice_id,
        distance: value.value,
        used: false,
    };

    let start, end;
    for( let i = 0; i < solution.vertices.length - 1; i++ ) {
        start = solution.vertices[i];
        end = solution.vertices[i+1]

        if(obj.source === start.id && obj.target === end.id) {
            obj.used = true;
        }
    }

    links.push(obj);
};

links.sort((a, b) => a.used > b.used)

const tooltipEdge = d3.select('#tooltip-edge')

const link = svg.append("g")
  .attr("class", "link")
  .selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("stroke", "#e6e6e6" )
  .attr("stroke-width", function(d) { return Math.sqrt(d.distance / 10); })
  .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9)
         .style("z-index", 50);
       div.html(`(${d.source.id}, ${d.target.id}): ${d.distance}`)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       })
  .attr('stroke', function(l) {
    return l.used ? '#000' : '#f3f3f3';
  })
  .attr('stroke-opacity', l => {
    l.used ? 1 : 0.5
  })

const div = d3.select('#tooltip');

var node = svg.append('g')
    .attr('class', 'vertex')
    .selectAll('line')
    .data(problem.vertices)
    .enter().append("circle")
    .attr("r", 5)
    .attr("fill", function(d) { return color(d.id); })
    .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9)
         .style("z-index", 50);
       div.html(d.id)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });

simulation
  .nodes(problem.vertices)
  .on("tick", ticked);

simulation.force("link")
  .links(links);

function ticked() {
  link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
}

link.each(function (l) {
    
});

debugger;