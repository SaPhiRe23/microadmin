import docker, os, time

NETWORK = os.getenv("DOCKER_NETWORK", "microadmin_net")
PORT = 8080

def build_and_run(service_name: str, path: str, tag_prefix="microadmin/user"):
    client = docker.from_env()
    image_tag = f"{tag_prefix}:{service_name}"
    # Build image
    img, build_logs = client.images.build(path=path, tag=image_tag)
    # Remove existing
    container_name = f"ms_{service_name}"
    try:
        old = client.containers.get(container_name)
        old.remove(force=True)
    except docker.errors.NotFound:
        pass
    # Run
    cont = client.containers.run(
        image=image_tag, name=container_name, detach=True,
        network=NETWORK, ports={f"{PORT}/tcp": None}
    )
    # small wait
    time.sleep(1.2)
    return {"image": image_tag, "container": container_name, "id": cont.id[:12]}
