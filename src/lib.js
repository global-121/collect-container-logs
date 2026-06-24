import { execSync } from 'child_process';

let runCommand = execSync;

export function __setRunCommandForTests(fn) {
  runCommand = fn;
}

export function __resetRunCommandForTests() {
  runCommand = execSync;
}

function run(cmd, { passthrough = false } = {}) {
  return runCommand(cmd, {
    encoding: 'utf-8',
    env: process.env,
    stdio: passthrough ? 'inherit' : 'pipe',
  });
}

export function getContainers() {
  const ps = run('docker ps -a --format "{{json .}}" --no-trunc');

  return ps
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const parsed = JSON.parse(line);
      return {
        id: parsed.ID,
        image: parsed.Image,
        name: parsed.Names,
        status: parsed.Status,
      };
    });
}

export function getLogsFromContainer(containerId) {
  run(`docker logs ${containerId}`, {
    passthrough: true,
  });
}
