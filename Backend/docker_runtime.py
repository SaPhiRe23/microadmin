import docker, os, time

NETWORK = os.getenv("DOCKER_NETWORK", "microadmin_net")
PORT = 8080

def _client():
    host = os.getenv("DOCKER_HOST")
    if host:
        return docker.DockerClient(base_url=host)
    return docker.from_env()

def build_and_run(service_name: str, path: str, tag_prefix="microadmin/user"):
    client = _client()
    image_tag = f"{tag_prefix}:{service_name}"
    img, _ = client.images.build(path=path, tag=image_tag)
    container_name = f"ms_{service_name}"
    try:
        old = client.containers.get(container_name)
        old.remove(force=True)
    except docker.errors.NotFound:
        pass
    cont = client.containers.run(
        image=image_tag, name=container_name, detach=True,
        network=NETWORK if NETWORK else None, ports={f"{PORT}/tcp": None}
    )
    time.sleep(1.0)
    host_port = None
    try:
        cont.reload()
        ports = (cont.attrs.get("NetworkSettings", {}) or {}).get("Ports", {})
        bindings = ports.get(f"{PORT}/tcp") or []
        if bindings:
            host_port = bindings[0].get("HostPort")
    except Exception:
        pass
    return {"image": image_tag, "container": container_name, "id": cont.id[:12], "host_port": host_port}
