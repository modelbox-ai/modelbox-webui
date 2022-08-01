export let solutions = {
  driver: {
    "dir": [
      "/usr/local/share/modelbox/demo/hello_world/flowunit"
    ]
  },
  flow: {
    "desc": "A hello world REST API service demo.",
    "name": "HelloWorld"
  },
  graph: {
    "graphconf": "digraph hello_world_diagraph {\n    node [shape=Mrecord]\n    httpserver_sync_receive[type=flowunit, flowunit=httpserver_sync_receive, device=cpu, time_out_ms=5000, endpoint=\"http://0.0.0.0:7770\", max_requests=100]\n    hello_world[type=flowunit, flowunit=hello_world, device=cpu]\n    httpserver_sync_reply[type=flowunit, flowunit=httpserver_sync_reply, device=cpu]\n\n    httpserver_sync_receive:out_request_info -> hello_world:in_data\n    hello_world:out_data -> httpserver_sync_reply:in_reply_info\n}\n",
    "format": "graphviz"
  }
}
