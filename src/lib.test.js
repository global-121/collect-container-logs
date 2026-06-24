import { execSync } from 'child_process';
import test, { after, before, describe } from 'node:test';
import assert from 'node:assert/strict';

import { getContainers, getLogsFromContainer } from './lib.js';

const CONTAINER_NAME = 'docker-gh-logs-tester';
const CONTAINER_IMAGE = 'ubuntu:26.04';

function isDockerAvailable() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function startContainer() {
  execSync(`docker run --name=${CONTAINER_NAME} ${CONTAINER_IMAGE} echo "foo"`);
}

function killContainer() {
  try {
    execSync(`docker rm -f ${CONTAINER_NAME}`, { stdio: 'ignore' });
  } catch {
    // ignore
  }
}

describe('collect-container-logs', () => {
  before(() => {
    killContainer();
  });

  after(() => {
    killContainer();
  });

  test(
    'should find running containers and get logs',
    { skip: !isDockerAvailable() },
    () => {
      startContainer();

      const container = getContainers().find(
        (item) => item.name === CONTAINER_NAME,
      );

      if (!container) {
        throw new Error('Did not find container');
      }

      assert.deepEqual(container, {
        id: container.id,
        image: CONTAINER_IMAGE,
        name: CONTAINER_NAME,
        status: container.status,
      });

      const log = execSync(`docker logs ${container.id}`, {
        encoding: 'utf-8',
      });
      getLogsFromContainer(container.id);
      assert.match(log, /foo/);
    },
  );
});
