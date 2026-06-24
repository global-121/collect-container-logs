import { getContainers, getLogsFromContainer } from './lib.js';

const containers = getContainers();

console.log(`Found ${containers.length} containers...`);
console.log('\n');

for (const container of containers) {
  const { id, image, name, status } = container;

  console.log(`::group::${image} (${name})`);

  console.log(
    '**********************************************************************',
  );
  console.log(`* Name  : ${name}`);
  console.log(`* Image : ${image}`);
  console.log(`* Status: ${status}`);
  console.log(
    '**********************************************************************',
  );

  getLogsFromContainer(id);

  console.log(`::endgroup::`);
}
