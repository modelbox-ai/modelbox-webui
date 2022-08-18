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

export let project = {
  "name": "cqw1234",
  "rootpath": "/root",
  "graph": {
    "graphName": "hello_world_diagraph",
    "graphDesc": "A hello world REST API service demo.",
    "dotSrc": "digraph hello_world_diagraph {\n    node [shape=Mrecord]\n    httpserver_sync_receive[type=flowunit, flowunit=httpserver_sync_receive, device=cpu, time_out_ms=5000, endpoint=\"http://0.0.0.0:7770\", max_requests=100]\n    hello_world[type=flowunit, flowunit=hello_world, device=cpu]\n    httpserver_sync_reply[type=flowunit, flowunit=httpserver_sync_reply, device=cpu]\n\n    httpserver_sync_receive:out_request_info -> hello_world:in_data\n    hello_world:out_data -> httpserver_sync_reply:in_reply_info\n}\n",
    "dotSrcLastChangeTime": 1660036588037,
    "svgString": "<svg width=\"1632\" height=\"783\" viewBox=\"0 0 1224 587.25\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n<g id=\"graph0\" class=\"graph\" transform=\"translate(535.9800033569336,385.125) scale(1)\">\n<title>hello_world_diagraph</title>\n<polygon fill=\"white\" stroke=\"transparent\" points=\"-4,4 -4,-187 156.04,-187 156.04,4 -4,4\"/>\n<!-- httpserver_sync_receive -->\n<g id=\"node1\" class=\"node\" style=\"filter: url(&quot;#drop-shadow&quot;);\">\n<title>httpserver_sync_receive</title>\n<path fill=\"white\" stroke=\"#99CC33\" d=\"M12,-146.5C12,-146.5 140.04,-146.5 140.04,-146.5 146.04,-146.5 152.04,-152.5 152.04,-158.5 152.04,-158.5 152.04,-170.5 152.04,-170.5 152.04,-176.5 146.04,-182.5 140.04,-182.5 140.04,-182.5 12,-182.5 12,-182.5 6,-182.5 0,-176.5 0,-170.5 0,-170.5 0,-158.5 0,-158.5 0,-152.5 6,-146.5 12,-146.5\"/>\n<text text-anchor=\"middle\" x=\"76.02\" y=\"-160.3\" font-family=\"Times,serif\" font-size=\"12\" fill=\"#252B3A\" font-weight=\"600\">httpserver_sync_receive</text>\n<defs><filter id=\"drop-shadow\"><feGaussianBlur in=\"SourceAlpha\" result=\"blur\" stdDeviation=\"2\"/><feOffset result=\"offsetBlur\" in=\"blur\" dx=\"1\" dy=\"1\"/><feMerge><feMergeNode in=\"offsetBlur\"/><feMergeNode in=\"SourceGraphic\"/></feMerge></filter></defs></g>\n<!-- hello_world -->\n<g id=\"node2\" class=\"node\" style=\"filter: url(&quot;#drop-shadow&quot;);\">\n<title>hello_world</title>\n<path fill=\"white\" stroke=\"#99CC33\" d=\"M46.2,-73.5C46.2,-73.5 105.85,-73.5 105.85,-73.5 111.85,-73.5 117.85,-79.5 117.85,-85.5 117.85,-85.5 117.85,-97.5 117.85,-97.5 117.85,-103.5 111.85,-109.5 105.85,-109.5 105.85,-109.5 46.2,-109.5 46.2,-109.5 40.2,-109.5 34.2,-103.5 34.2,-97.5 34.2,-97.5 34.2,-85.5 34.2,-85.5 34.2,-79.5 40.2,-73.5 46.2,-73.5\"/>\n<text text-anchor=\"middle\" x=\"76.02\" y=\"-87.3\" font-family=\"Times,serif\" font-size=\"12\" fill=\"#252B3A\" font-weight=\"600\">hello_world</text>\n<defs><filter id=\"drop-shadow\"><feGaussianBlur in=\"SourceAlpha\" result=\"blur\" stdDeviation=\"2\"/><feOffset result=\"offsetBlur\" in=\"blur\" dx=\"1\" dy=\"1\"/><feMerge><feMergeNode in=\"offsetBlur\"/><feMergeNode in=\"SourceGraphic\"/></feMerge></filter></defs></g>\n<!-- httpserver_sync_receive&#45;&gt;hello_world -->\n<g id=\"edge1\" class=\"edge\">\n<title>httpserver_sync_receive:out_request_info-&gt;hello_world:in_data</title>\n<path fill=\"none\" stroke=\"#ADB0B8\" d=\"M76.02,-146.46C76.02,-138.38 76.02,-128.68 76.02,-119.68\"/>\n<polygon fill=\"#ADB0B8\" stroke=\"#ADB0B8\" points=\"79.52,-119.59 76.02,-109.59 72.52,-119.59 79.52,-119.59\"/>\n</g>\n<!-- httpserver_sync_reply -->\n<g id=\"node3\" class=\"node\" style=\"filter: url(&quot;#drop-shadow&quot;);\">\n<title>httpserver_sync_reply</title>\n<path fill=\"white\" stroke=\"#99CC33\" d=\"M17.82,-0.5C17.82,-0.5 134.22,-0.5 134.22,-0.5 140.22,-0.5 146.22,-6.5 146.22,-12.5 146.22,-12.5 146.22,-24.5 146.22,-24.5 146.22,-30.5 140.22,-36.5 134.22,-36.5 134.22,-36.5 17.82,-36.5 17.82,-36.5 11.82,-36.5 5.82,-30.5 5.82,-24.5 5.82,-24.5 5.82,-12.5 5.82,-12.5 5.82,-6.5 11.82,-0.5 17.82,-0.5\"/>\n<text text-anchor=\"middle\" x=\"76.02\" y=\"-14.3\" font-family=\"Times,serif\" font-size=\"12\" fill=\"#252B3A\" font-weight=\"600\">httpserver_sync_reply</text>\n<defs><filter id=\"drop-shadow\"><feGaussianBlur in=\"SourceAlpha\" result=\"blur\" stdDeviation=\"2\"/><feOffset result=\"offsetBlur\" in=\"blur\" dx=\"1\" dy=\"1\"/><feMerge><feMergeNode in=\"offsetBlur\"/><feMergeNode in=\"SourceGraphic\"/></feMerge></filter></defs></g>\n<!-- hello_world&#45;&gt;httpserver_sync_reply -->\n<g id=\"edge2\" class=\"edge\">\n<title>hello_world:out_data-&gt;httpserver_sync_reply:in_reply_info</title>\n<path fill=\"none\" stroke=\"#ADB0B8\" d=\"M76.02,-73.46C76.02,-65.38 76.02,-55.68 76.02,-46.68\"/>\n<polygon fill=\"#ADB0B8\" stroke=\"#ADB0B8\" points=\"79.52,-46.59 76.02,-36.59 72.52,-46.59 79.52,-46.59\"/>\n</g>\n</g>\n</svg>",
    "skipDefault": false,
    "dirs": "/root/cqw1234/src/flowunit",
    "settingPerfEnable": false,
    "settingPerfTraceEnable": false,
    "settingPerfSessionEnable": false,
    "settingPerfDir": "/tmp/modelbox/perf/",
    "flowunitDebugPath": "/root/cqw1234/src/flowunit",
    "flowunitReleasePath": "/opt/modelbox/application/cqw1234"
  },
  "flowunit": {
    "name": "flowunit",
    "desc": "",
    "lang": "python",
    "project-path": "/root/cqw1234",
    "device": "cpu",
    "port_infos": [],
    "type": "stream",
    "virtual-type": "tensorflow",
    "group-type": "generic",
    "model": "",
    "plugin": ""
  }
}

export let openProject =
{
  "flowunits": [
    {
      "base": {
        "description": "show hello world",
        "device": "cpu",
        "entry": "hello_world@HelloWorld",
        "name": "hello_world",
        "type": "python",
        "version": "1.0.0"
      },
      "config": {
        "item": "value"
      },
      "input": {
        "input1": {
          "name": "in_data"
        }
      },
      "output": {
        "output1": {
          "name": "out_data"
        }
      }
    }
  ],
  "graphs": [
    {
      "driver": {
        "dir": [
          "/opt/modelbox/application/cqw1234/flowunit"
        ]
      },
      "flow": {
        "desc": "A hello world REST API service demo.",
        "name": "HelloWorld"
      },
      "graph": {
        "format": "graphviz",
        "graphconf": "digraph hello_world_diagraph {\n    node [shape=Mrecord]\n    httpserver_sync_receive[type=flowunit, flowunit=httpserver_sync_receive, device=cpu, time_out_ms=5000, endpoint=\"http://0.0.0.0:7770\", max_requests=100]\n    hello_world[type=flowunit, flowunit=hello_world, device=cpu]\n    httpserver_sync_reply[type=flowunit, flowunit=httpserver_sync_reply, device=cpu]\n\n    httpserver_sync_receive:out_request_info -> hello_world:in_data\n    hello_world:out_data -> httpserver_sync_reply:in_reply_info\n}\n"
      }
    }
  ],
  "project_name": "cqw1234",
  "project_path": "/root/cqw1234"
}

