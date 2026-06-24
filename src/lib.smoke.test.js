import assert from 'node:assert/strict';
import test from 'node:test';

import {
  __resetRunCommandForTests,
  __setRunCommandForTests,
  getContainers,
  getLogsFromContainer,
} from './lib.js';

test('smoke: parses containers and requests docker logs without Docker daemon', () => {
  const commands = [];
  const mockExecSync = (cmd, options = {}) => {
    commands.push({ cmd, options });

    if (cmd.startsWith('docker ps -a')) {
      return [
        '{"ID":"abc123","Image":"redis:7","Names":"redis-main","Status":"Up 2 minutes"}',
        '{"ID":"def456","Image":"postgres:16","Names":"db-main","Status":"Exited (0) 4 seconds ago"}',
        '',
      ].join('\n');
    }

    return '';
  };

  __setRunCommandForTests(mockExecSync);

  try {
    const containers = getContainers();
    assert.deepEqual(containers, [
      {
        id: 'abc123',
        image: 'redis:7',
        name: 'redis-main',
        status: 'Up 2 minutes',
      },
      {
        id: 'def456',
        image: 'postgres:16',
        name: 'db-main',
        status: 'Exited (0) 4 seconds ago',
      },
    ]);

    getLogsFromContainer('abc123');

    assert.equal(
      commands[0].cmd,
      'docker ps -a --format "{{json .}}" --no-trunc',
    );
    assert.equal(commands[1].cmd, 'docker logs abc123');
  } finally {
    __resetRunCommandForTests();
  }
});
