export let solutionList = {
  demo_list: [
    {
      "demo": "car_detection",
      "desc": "car detection for video streams",
      "graphfile": "car_detection.toml",
      "name": "car_detection.toml"
    },
    {
      "demo": "emotion_detection",
      "desc": "face emotion detection for video",
      "graphfile": "emotion_detection.toml",
      "name": "emotion_detection.toml"
    },
    {
      "demo": "hello_world",
      "desc": "A hello world REST API service demo.",
      "graphfile": "hello_world.toml",
      "name": "HelloWorld"
    },
    {
      "demo": "mnist",
      "desc": "MNIST detection for image",
      "graphfile": "mnist.toml",
      "name": "MNIST"
    }
  ]
}

export let solutionListTarget = [
  {
    "demo": "car_detection",
    "desc": "car detection for video streams",
    "graphfile": "car_detection.toml",
    "name": "car_detection.toml"
  },
  {
    "demo": "emotion_detection",
    "desc": "face emotion detection for video",
    "graphfile": "emotion_detection.toml",
    "name": "emotion_detection.toml"
  },
  {
    "demo": "hello_world",
    "desc": "A hello world REST API service demo.",
    "graphfile": "hello_world.toml",
    "name": "HelloWorld"
  },
  {
    "demo": "mnist",
    "desc": "MNIST detection for image",
    "graphfile": "mnist.toml",
    "name": "MNIST"
  }
]

export let loadTreeByPath = {
  "dirname": "/root/pro1",
  "isproject": true,
  "subdir": [
    {
      "dirname": "CMake",
      "isproject": false
    },
    {
      "dirname": "package",
      "isproject": false
    },
    {
      "dirname": "src",
      "isproject": false
    },
    {
      "dirname": "test",
      "isproject": false
    },
    {
      "dirname": "thirdparty",
      "isproject": false
    }
  ]
}

export let templateTarget = {
  "project_template_list":
    [
      {
        "desc": "A mnist with mindspore example project template for modelbox",
        "dirname": "mnist-mindspore",
        "name": "mnist-mindspore",
        "restapi": {
          "method": "POST",
          "path": "http://0.0.0.0:8190/v1/mnist_test",
          "requestbody": "{\n  \"image_base64\": \"\"\n}\n"
        }
      },
      {
        "desc": "A car detection example project template for modelbox",
        "dirname": "car_detection",
        "name": "car detection"
      },
      {
        "desc": "A emotion detection example project template for modelbox",
        "dirname": "emotion_detection",
        "guide": {
          "guide": "\n# 使用指导\n\n需要执行工程根目录下download_emotion_files.sh下载torch模型。\n\n"
        },
        "name": "emotion_detection"
      },
      {
        "desc": "A resize example project template for modelbox",
        "dirname": "resize",
        "name": "resize"
      },
      {
        "desc": "A helloworld REST API service example project template for modelbox",
        "dirname": "hello_world",
        "name": "helloworld",
        "restapi": {
          "method": "POST",
          "path": "http://0.0.0.0:7770/v1/hello_world",
          "requestbody": "{\n  \"msg\": \"hello modelbox\"\n}\n"
        }
      },
      {
        "desc": "A empty project template for modelbox",
        "dirname": "empty",
        "name": "empty"
      },
      {
        "desc": "A mnist example project template for modelbox",
        "dirname": "mnist",
        "name": "mnist",
        "restapi": {
          "method": "POST",
          "path": "http://0.0.0.0:8190/v1/mnist_test",
          "requestbody": "{\n  \"image_base64\": \"\"\n}\n"
        }
      }
    ]
}

export let paramQueryData = {
  "dir": ["/root/face_detection/src/flowunit"],
  "skip-default": false
}

export let flowInfo = {
  devices: [
    {
      "descryption": "Host cpu device.",
      "name": "0",
      "type": "CPU",
      "version": ""
    }
  ],
  flowunits: [
    {
      "descryption": "\n\t@Brief: Modify the input buffer meta field name and value according to custom rules. \n\t@Port parameter: The input port and the output buffer type are binary. \n\t@Constraint: ",
      "group": "Image",
      "inputports": [
        {
          "name": "in_data"
        }
      ],
      "name": "buff_meta_mapping",
      "options": [
        {
          "default": "",
          "desc": "the source meta",
          "name": "src_meta",
          "required": true,
          "type": "string"
        },
        {
          "default": "",
          "desc": "the dest meta",
          "name": "dest_meta",
          "required": true,
          "type": "string"
        },
        {
          "default": "",
          "desc": "the meta mapping rules",
          "name": "rules",
          "required": false,
          "type": "string"
        }
      ],
      "outputports": [
        {
          "name": "out_data"
        }
      ],
      "type": "cpu",
      "version": "1.0.0",
      "virtual": false
    }
  ]
}

export let tasks = {
  job_list:
    [
      {
        "job_error_msg": "Not found, build graph from config fail. -> build node failed. name: 'hello_world' -> create flowunit 'hello_world' failed. -> can not find flowunit [type: cpu, name:hello_world], Please check if the 'device' configured correctly or if the flowunit library exists.",
        "job_id": "hello_world_diagraph.toml",
        "job_status": "FAILED"
      }
    ]
}

export let demoTarget = {
  "graph": {
    "graphconf": "digraph car_detection {\n    node [shape=Mrecord]\n    video_input[type=flowunit, flowunit=video_input, device=cpu, deviceid=0, source_url=\"/opt/modelbox/demo/video/car_test_video.mp4\"]\n    videodemuxer[type=flowunit, flowunit=video_demuxer, device=cpu, deviceid=0]\n    videodecoder[type=flowunit, flowunit=video_decoder, device=cuda, deviceid=0, pix_fmt=bgr]\n    image_resize[type=flowunit, flowunit=resize, device=cpu, deviceid=0, image_width=512, image_height=288]\n    image_transpose[type=flowunit, flowunit=packed_planar_transpose, device=cpu, deviceid=0]\n    normalize[type=flowunit, flowunit=normalize, device=cpu, deviceid=0, standard_deviation_inverse=\"1,1,1\"]\n    model_inference[type=flowunit, flowunit=car_detect, device=cuda, deviceid=0, batch_size=1]\n    yolox_post[type=flowunit, flowunit=yolox_post, device=cpu, deviceid=0]\n    videoencoder[type=flowunit, flowunit=video_encoder, device=cpu, deviceid=0, encoder=mpeg4, format=mp4, default_dest_url=\"/tmp/car_detection_result.mp4\"]\n\n    video_input:out_video_url -> videodemuxer:in_video_url\n    videodemuxer:out_video_packet -> videodecoder:in_video_packet\n    videodecoder:out_video_frame -> image_resize:in_image\n    image_resize:out_image -> image_transpose:in_image\n    image_transpose:out_image -> normalize:in_data\n    normalize:out_data -> model_inference:input\n    model_inference:output -> yolox_post:in_feat\n    videodecoder:out_video_frame -> yolox_post:in_image\n    yolox_post:out_data -> videoencoder:in_video_frame\n}",
    "format": "graphviz"
  },
  "driver": {
    "dir": [
      "/usr/local/share/modelbox/demo/car_detection/flowunit"
    ]
  },
  "flow": {
    "desc": "car detection for video streams"
  }
}

export let paramCreateProject = {
  "name": "testProject",
  "rootpath": "/root",
  "template": "hello_world"
}

export let paramCreateFlowunit = {
  "name": "flowunit",
  "desc": "",
  "lang": "python",
  "project-path": "/root/projectName",
  "device": "cpu",
  "type": "stream",
  "group-type": "generic"
}

export let paramCreateTask = {
  "job_id": "graph_ddd.toml",
  "graph_name": "graph_ddd.toml",
  "graph": {
    "flow": {
      "desc": "A resize modelbox project"
    },
    "driver": {
      "dir": "/root/ddd/src/flowunit"
    },
    "profile": {
      "profile": false,
      "trace": false,
      "session": false,
      "dir": "/tmp/modelbox/perf/"
    },
    "graph": {
      "graphconf": "digraph graph_ddd {\n\tnode [shape=Mrecord]\n  video_input[type=flowunit, flowunit=video_input, device=cpu, deviceid=0, repeat=20, source_url=\"/xxx/xxx.mp4\"]\n  videodemuxer[type=flowunit, flowunit=video_demuxer, device=cpu, deviceid=0, queue_size_event=1000, ] \n  videodecoder[type=flowunit, flowunit=video_decoder, device=cuda, deviceid=0, pix_fmt=\"nv12\"]\n  output1[type=output]  \n  video_input:out_video_url -> videodemuxer:in_video_url\n  videodemuxer:out_video_packet -> videodecoder:in_video_packet\n  videodecoder:out_video_frame -> output1\n}",
      "format": "graphviz"
    }
  },
  "job_graph": {
    "flow": {
      "desc": "A resize modelbox project"
    },
    "driver": {
      "dir": "/root/ddd/src/flowunit"
    },
    "profile": {
      "profile": false,
      "trace": false,
      "session": false,
      "dir": "/tmp/modelbox/perf/"
    },
    "graph": {
      "graphconf": "digraph graph_ddd {\n\tnode [shape=Mrecord]\n  video_input[type=flowunit, flowunit=video_input, device=cpu, deviceid=0, repeat=20, source_url=\"/xxx/xxx.mp4\"]\n  videodemuxer[type=flowunit, flowunit=video_demuxer, device=cpu, deviceid=0, queue_size_event=1000, ] \n  videodecoder[type=flowunit, flowunit=video_decoder, device=cuda, deviceid=0, pix_fmt=\"nv12\"]\n  output1[type=output]  \n  video_input:out_video_url -> videodemuxer:in_video_url\n  videodemuxer:out_video_packet -> videodecoder:in_video_packet\n  videodecoder:out_video_frame -> output1\n}",
      "format": "graphviz"
    }
  }
}

export let openProjectData = {
  "flowunits": [
    {
      "base": {
        "description": "A flowunit for modelbox",
        "device": "cpu",
        "entry": "flowunit@FlowunitFlowUnit",
        "group_type": "generic",
        "name": "flowunit",
        "stream": true,
        "type": "python",
        "version": "1.0.0"
      },
      "input": {
        "input1": {
          "device": "cpu",
          "name": "input1"
        }
      },
      "output": {
        "output1": {
          "name": "output1"
        }
      }
    }
  ],
  "graphs": [
    {
      "driver": {
        "dir": [
          "/opt/modelbox/application/ddd/flowunit"
        ],
        "skip-default": false
      },
      "flow": {
        "desc": "A resize modelbox project"
      },
      "graph": {
        "format": "graphviz",
        "graphconf": "digraph graph_ddd {\n  video_input[type=flowunit, flowunit=video_input, device=cpu, deviceid=0, repeat=20, source_url=\"/xxx/xxx.mp4\"]\n  videodemuxer[type=flowunit, flowunit=video_demuxer, device=cpu, deviceid=0, queue_size_event=1000, ] \n  videodecoder[type=flowunit, flowunit=video_decoder, device=cuda, deviceid=0, pix_fmt=\"nv12\"]\n  output1[type=output]  \n  video_input:out_video_url -> videodemuxer:in_video_url\n  videodemuxer:out_video_packet -> videodecoder:in_video_packet\n  videodecoder:out_video_frame -> output1\n}"
      },
      "profile": {
        "dir": "",
        "profile": false,
        "trace": false
      }
    },
    {
      "driver": {
        "dir": [
          "/root/ddd/src/flowunit"
        ],
        "skip-default": false
      },
      "flow": {
        "desc": "A resize modelbox project"
      },
      "graph": {
        "format": "graphviz",
        "graphconf": "digraph graph_ddd {\n\tnode [shape=Mrecord]\n  video_input [ type=flowunit flowunit=video_input device=cpu deviceid=\"0\" repeat=\"20\" source_url=\"/xxx/xxx.mp4\" ]\n  videodemuxer [ type=flowunit flowunit=video_demuxer device=cpu deviceid=\"0\" queue_size_event=\"1000\" ] \n  videodecoder [ type=flowunit flowunit=video_decoder device=cuda deviceid=\"0\" pix_fmt=nv12 ]\n  output1 [ type=output ]  \n\n  video_input:out_video_url -> videodemuxer:in_video_url\n  videodemuxer:out_video_packet -> videodecoder:in_video_packet\n  videodecoder:out_video_frame -> output1\n\n}\n"
      },
      "profile": {
        "dir": "/tmp/modelbox/perf/",
        "profile": false,
        "session": false,
        "trace": false
      }
    }
  ],
  "project_name": "ddd",
  "project_path": "/root/ddd"
}
