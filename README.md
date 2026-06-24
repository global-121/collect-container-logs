# Collect Container Logs

This is a GitHub Action which will collect logs from all running (Docker) containers.

Based on: [`jwalton/gh-docker-logs`](https://github.com/jwalton/gh-docker-logs)

## Usage

This action has no inputs and always writes output to stdout.

```yaml
- name: Collect container logs
  if: failure()
  uses: global-121/collect-container-logs@v3
```

Output is grouped by container and includes:

- Image and container name
- Basic container status metadata
- Full `docker logs` output for each container

---

## AI Disclaimer

Parts of the code in this repository were written and reviewed with the assistance of AI tools, including large language models (LLMs).

All AI-generated code has been reviewed by human contributors before being merged. The humans involved take responsibility for the correctness and quality of the code.

If you have questions or concerns, please contact the maintainers.

## License

Released under the Apache 2.0 License. See [LICENSE](LICENSE).
