
import { fetchJSON, renderProjects, fetchGitHubData} from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const latestProjects = projects.slice(0, 3);
const container = document.querySelector('.projects');

renderProjects(latestProjects, container, 'h2');


const user1 = await fetchGitHubData('haw129-spec');
const user2 = await fetchGitHubData('Ricki-C');

const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
  profileStats.innerHTML = `
    <dl>
      <dt>${user1.login} Repos:</dt><dd>${user1.public_repos}</dd>
      <dt>${user1.login} Followers:</dt><dd>${user1.followers}</dd>

      <dt>${user2.login} Repos:</dt><dd>${user2.public_repos}</dd>
      <dt>${user2.login} Followers:</dt><dd>${user2.followers}</dd>
    </dl>
  `;
}