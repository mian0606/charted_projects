import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from './global.js';
//data in lib
const projects = await fetchJSON('./lib/projects.json');
const container = document.querySelector('.projects');

renderProjects(projects, container, 'h2');


let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);

let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let svg = d3.select('#projects-pie-plot');
let legend = d3.select('.legend');


let query = '';
let selectedIndex = -1;


arcs.forEach((arc, idx) => {
  svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(idx))
    .attr('class', selectedIndex === idx ? 'selected' : '')
    .on('click', () => {

      selectedIndex = selectedIndex === idx ? -1 : idx;

      svg
        .selectAll('path')
        .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''));


      legend
        .selectAll('li')
        .attr('class', (_, idx) => selectedIndex === idx ? 'legend-item selected' : 'legend-item');
      let base = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
      });

      if (selectedIndex === -1) {
        renderProjects(base, container, 'h2');
      } else {
        let selectedYear = data[selectedIndex].label;

        let filtered = base.filter(
          (project) => project.year === selectedYear
        );

        renderProjects(filtered, container, 'h2');
      }
    });
});


data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('style', `--color:${colors(idx)}`)
    .attr('class', (_, idx) => selectedIndex === idx ? 'legend-item selected' : 'legend-item')
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});





let searchInput = document.querySelector('.searchBar');


searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();

    let matchesSearch = values.includes(query.toLowerCase());

    let matchesYear =
      selectedIndex === -1 || project.year === data[selectedIndex].label;

    return matchesSearch && matchesYear;
  });

  renderProjects(filteredProjects, container, 'h2');
});


