export let context_origin = {
  "active": false,
  "descryption": "\n\t@Brief: Start a http/https server, output request info to next flowunit. \n\t@Port parameter: The output port buffer contain the following meta fields:\n\t\tField Name: size,        Type: size_t\n\t\tField Name: method,      Type: string\n\t\tField Name: uri,         Type: string\n\t\tField Name: headers,     Type: map<string,string>\n\t\tField Name: endpoint,    Type: string\n\t  The the output port buffer data type is char * .\n\t@Constraint: The flowuint 'httpserver_sync_receive' must be used pair with 'httpserver_sync_reply'.",
  "group": "Input",
  "inputports": [],
  "name": "httpserver_sync_receive",
  "options": [
    {
      "default": "https://127.0.0.1:8080",
      "desc": "http server listen URL.",
      "name": "endpoint",
      "required": true,
      "type": "string"
    },
    {
      "default": "1000",
      "desc": "max http request.",
      "name": "max_requests",
      "required": false,
      "type": "integer"
    },
    {
      "default": "200",
      "desc": "keep-alive timeout time(sec)",
      "name": "keepalive_timeout_sec",
      "required": false,
      "type": "integer"
    },
    {
      "default": "5000",
      "desc": "max http request timeout. ",
      "name": "time_out_ms",
      "required": false,
      "type": "integer"
    },
    {
      "default": "",
      "desc": "cert file path",
      "name": "cert",
      "required": false,
      "type": "string"
    },
    {
      "default": "",
      "desc": "key file path",
      "name": "key",
      "required": false,
      "type": "string"
    },
    {
      "default": "",
      "desc": "encrypted key file password.",
      "name": "passwd",
      "required": false,
      "type": "string"
    },
    {
      "default": "",
      "desc": "key for encrypted password.",
      "name": "key_pass",
      "required": false,
      "type": "string"
    }
  ],
  "outputports": [
    {
      "name": "out_request_info"
    }
  ],
  "title": "httpserver_sync_receive",
  "type": "cpu",
  "types": ['cpu'],
  "version": "1.0.0",
  "virtual": false
};

export let context_target = {
  "active": false,
  "constraint": "The flowuint 'httpserver_sync_receive' must be used pair with 'httpserver_sync_reply'.",
  "desc": "Start a http/https server, output request info to next flowunit.",
  "descryption": "\n\t@Brief: Start a http/https server, output request info to next flowunit. \n\t@Port parameter: The output port buffer contain the following meta fields:\n\t\tField Name: size,        Type: size_t\n\t\tField Name: method,      Type: string\n\t\tField Name: uri,         Type: string\n\t\tField Name: headers,     Type: map<string,string>\n\t\tField Name: endpoint,    Type: string\n\t  The the output port buffer data type is char * .\n\t@Constraint: The flowuint 'httpserver_sync_receive' must be used pair with 'httpserver_sync_reply'.",
  "group": "Input",
  "inputports": [],
  "name": "httpserver_sync_receive",
  "options": [
    {
      "default": "https://127.0.0.1:8080",
      "desc": "http server listen URL.",
      "name": "endpoint",
      "required": true,
      "type": "string"
    },
    {
      "default": "1000",
      "desc": "max http request.",
      "name": "max_requests",
      "required": false,
      "type": "integer"
    },
    {
      "default": "200",
      "desc": "keep-alive timeout time(sec)",
      "name": "keepalive_timeout_sec",
      "required": false,
      "type": "integer"
    },
    {
      "default": "5000",
      "desc": "max http request timeout. ",
      "name": "time_out_ms",
      "required": false,
      "type": "integer"
    },
    {
      "default": "",
      "desc": "cert file path",
      "name": "cert",
      "required": false,
      "type": "string"
    },
    {
      "default": "",
      "desc": "key file path",
      "name": "key",
      "required": false,
      "type": "string"
    },
    {
      "default": "",
      "desc": "encrypted key file password.",
      "name": "passwd",
      "required": false,
      "type": "string"
    },
    {
      "default": "",
      "desc": "key for encrypted password.",
      "name": "key_pass",
      "required": false,
      "type": "string"
    }
  ],
  "outputports": [
    {
      "name": "out_request_info"
    }
  ],
  "portDetail": "The output port buffer contain the following meta fields\nThe the output port buffer data type is char * .",
  "title": "httpserver_sync_receive",
  "type": "cpu",
  "types": ['cpu'],
  "version": "1.0.0",
  "virtual": false
};

export let unit_target = {
  name: '',
  version: '',
  descryption: '',
  desc: '',
  group: '',
  virtual: false,
  types: [],
  type: '',
  options: [""],
  inputports: [""],
  outputports: [""],
  portDetail: '',
  constraint: ''
}

export let unit_http_receive = {
  "active": false,
  "descryption": "\n\t@Brief: Start a http/https server, output request info to next flowunit. \n\t@Port parameter: The output port buffer contain the following meta fields:\n\t\tField Name: size,        Type: size_t\n\t\tField Name: method,      Type: string\n\t\tField Name: uri,         Type: string\n\t\tField Name: headers,     Type: map<string,string>\n\t\tField Name: endpoint,    Type: string\n\t  The the output port buffer data type is char * .\n\t@Constraint: The flowuint 'httpserver_sync_receive' must be used pair with 'httpserver_sync_reply'.",
  "group": "Input",
  "inputports": [],
  "name": "httpserver_sync_receive",
  "options": [
    {
      "default": "https://127.0.0.1:8080",
      "desc": "http server listen URL.",
      "name": "endpoint",
      "required": true,
      "type": "string"
    },
    {
      "default": "1000",
      "desc": "max http request.",
      "name": "max_requests",
      "required": false,
      "type": "integer"
    },
    {
      "default": "200",
      "desc": "keep-alive timeout time(sec)",
      "name": "keepalive_timeout_sec",
      "required": false,
      "type": "integer"
    },
    {
      "default": "5000",
      "desc": "max http request timeout. ",
      "name": "time_out_ms",
      "required": false,
      "type": "integer"
    },
    {
      "default": "",
      "desc": "cert file path",
      "name": "cert",
      "required": false,
      "type": "string"
    },
    {
      "default": "",
      "desc": "key file path",
      "name": "key",
      "required": false,
      "type": "string"
    },
    {
      "default": "",
      "desc": "encrypted key file password.",
      "name": "passwd",
      "required": false,
      "type": "string"
    },
    {
      "default": "",
      "desc": "key for encrypted password.",
      "name": "key_pass",
      "required": false,
      "type": "string"
    }
  ],
  "outputports": [
    {
      "name": "out_request_info"
    }
  ],
  "title": "httpserver_sync_receive",
  "type": "cpu",
  "types": ['cpu'],
  "version": "1.0.0",
  "virtual": false
}

export let config = {
  "name": "httpserver_sync_receive",
  "attributes": [
    {
      "key": "type",
      "value": "flowunit"
    },
    {
      "key": "flowunit",
      "value": "httpserver_sync_receive"
    },
    {
      "key": "device",
      "value": "cpu"
    },
    {
      "key": "time_out_ms",
      "value": "5000"
    },
    {
      "key": "endpoint",
      "value": "http://0.0.0.0:7770"
    },
    {
      "key": "max_requests",
      "value": "100"
    },
    {
      "key": "label",
      "value": "{httpserver_sync_receive|{<out_request_info> out_request_info}}"
    }
  ],
  "locations": [
    {
      "start": {
        "offset": 60,
        "line": 3,
        "column": 5
      },
      "end": {
        "offset": 286,
        "line": 3,
        "column": 231
      }
    },
    {
      "start": {
        "offset": 580,
        "line": 7,
        "column": 5
      },
      "end": {
        "offset": 622,
        "line": 7,
        "column": 47
      }
    }
  ],
}

export let unit_type_target = {

  "options": [
    {
      "id": "cpu",
      "label": "cpu"
    }
  ],
  "selected": {
    "id": "cpu",
    "label": "cpu"
  }
}

export let unit_options_data_target = [
  {
    "label": "endpoint",
    "required": true,
    "type": "string",
    "default": "https://127.0.0.1:8080",
    "desc": "http server listen URL.",
    "value": "https://127.0.0.1:8080"
  },
  {
    "label": "max requests",
    "required": false,
    "type": "integer",
    "default": "1000",
    "desc": "max http request.",
    "value": "1000"
  },
  {
    "label": "keepalive timeout sec",
    "required": false,
    "type": "integer",
    "default": "200",
    "desc": "keep-alive timeout time(sec)",
    "value": "200"
  },
  {
    "label": "time out ms",
    "required": false,
    "type": "integer",
    "default": "5000",
    "desc": "max http request timeout. ",
    "value": "5000"
  },
  {
    "label": "cert",
    "required": false,
    "type": "string",
    "default": "",
    "desc": "cert file path",
    "value": ""
  },
  {
    "label": "key",
    "required": false,
    "type": "string",
    "default": "",
    "desc": "key file path",
    "value": ""
  },
  {
    "label": "passwd",
    "required": false,
    "type": "string",
    "default": "",
    "desc": "encrypted key file password.",
    "value": ""
  },
  {
    "label": "key pass",
    "required": false,
    "type": "string",
    "default": "",
    "desc": "key for encrypted password.",
    "value": ""
  }
]

export let config_initialed = {
  "attributes": [
    {
      "key": "type",
      "value": "flowunit"
    },
    {
      "key": "flowunit",
      "value": "httpserver_sync_receive"
    },
    {
      "key": "device",
      "value": "cpu"
    },
    {
      "key": "time_out_ms",
      "value": "5000"
    },
    {
      "key": "endpoint",
      "value": "http://0.0.0.0:7770"
    },
    {
      "key": "max_requests",
      "value": "100"
    },
    {
      "key": "label",
      "value": "{httpserver_sync_receive|{<out_request_info> out_request_info}}"
    }
  ],
  "locations": [
    {
      "start": {
        "offset": 60,
        "line": 3,
        "column": 5
      },
      "end": {
        "offset": 286,
        "line": 3,
        "column": 231
      }
    },
    {
      "start": {
        "offset": 572,
        "line": 7,
        "column": 5
      },
      "end": {
        "offset": 612,
        "line": 7,
        "column": 45
      }
    }
  ],
  "name": "httpserver_sync_receive"
}

export let unit_example = {
  "descryption": "\n\t@Brief: A resize flowunit on cuda device. \n\t@Port parameter: The input port buffer type and the output port buffer type are image. \n\t  The image type buffer contains the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType->MODELBOX_UINT8\n\t@Constraint: The field value range of this flowunit supports: 'pix_fmt': [rgb_packed,bgr_packed], 'layout': [hwc]. ",
  "group": "Image",
  "inputports": [
    {
      "name": "in_image"
    }
  ],
  "name": "resize",
  "advance": {
    deviceid: "",
    batchSize: "",
    queueSize: ""
  },
  "options": [
    {
      "default": "640",
      "desc": "the resize width",
      "name": "image_width",
      "required": true,
      "type": "int"
    },
    {
      "default": "480",
      "desc": "the resize height",
      "name": "image_height",
      "required": true,
      "type": "int"
    },
    {
      "default": "inter_linear",
      "desc": "the resize interpolation",
      "name": "interpolation",
      "required": true,
      "type": "list",
      "values": {
        "inter_cubic": "inter_cubic",
        "inter_lanczos": "inter_lanczos",
        "inter_linear": "inter_linear",
        "inter_nn": "inter_nn",
        "inter_super": "inter_super"
      }
    }
  ],
  "outputports": [
    {
      "name": "out_image"
    }
  ],
  "type": "cuda",
  "version": "1.0.0",
  "virtual": false,
  "title": "resize",
  "active": false,
  "types": [
    "cpu",
    "cuda"
  ],
  "constraint": "The field value range of this flowunit supports: 'pix_fmt': [rgb_packed,bgr_packed], 'layout': [hwc].",
  "desc": "A resize flowunit on cuda device.",
  "portDetail": "The input port buffer type and the output port buffer type are image.\nThe image type buffer contains the following meta fields"
}

export let unit_options_example = {
  "data": [
    {
      "label": "pix fmt",
      "required": true,
      "type": "list",
      "default": "0",
      "desc": "the decoder pixel format",
      "values": {
        "bgr": "bgr",
        "nv12": "nv12",
        "rgb": "rgb"
      },
      "options": [
        {
          "id": "bgr",
          "label": "bgr"
        },
        {
          "id": "nv12",
          "label": "nv12"
        },
        {
          "id": "rgb",
          "label": "rgb"
        }
      ],
      "selected": {
        "id": "bgr",
        "label": "bgr"
      }
    }
  ]
}

export let dotGraph_example = {
  "dotSrc": "digraph car_detection {\n    node [shape=Mrecord]\n    video_input [ type=flowunit flowunit=video_input device=cpu deviceid=\"0\" source_url=\"@DEMO_VIDEO_DIR@/car_test_video.mp4\" label=\"{video_input|{<out_video_url> out_video_url}}\" ]\n    videodemuxer [ type=flowunit flowunit=video_demuxer device=cpu deviceid=\"0\" label=\"{{<in_video_url> in_video_url}|videodemuxer|{<out_video_packet> out_video_packet}}\" ]\n    videodecoder [ type=flowunit flowunit=video_decoder device=cpu deviceid=\"0\" pix_fmt=bgr label=\"{{<in_video_packet> in_video_packet}|videodecoder|{<out_video_frame> out_video_frame}}\" ]\n    image_resize [ type=flowunit flowunit=resize device=cpu deviceid=\"0\" image_width=\"512\" image_height=\"288\" interpolation=inter_linear label=\"{{<in_image> in_image}|image_resize|{<out_image> out_image}}\" ]\n    image_transpose [ type=flowunit flowunit=packed_planar_transpose device=cpu deviceid=\"0\" label=\"{{<in_image> in_image}|image_transpose|{<out_image> out_image}}\" ]\n    normalize [ type=flowunit flowunit=normalize device=cpu deviceid=\"0\" standard_deviation_inverse=\"1,1,1\" label=\"{{<in_data> in_data}|normalize|{<out_data> out_data}}\" ]\n    model_inference [ type=flowunit flowunit=car_detect device=cuda deviceid=\"0\" batch_size=\"1\" label=\"{{<input> input}|model_inference|{<output> output}}\" ]\n    yolox_post [ type=flowunit flowunit=yolox_post device=cpu deviceid=\"0\" label=\"{{<in_image> in_image|<in_feat> in_feat}|yolox_post|{<out_data> out_data}}\" ]\n    videoencoder [ type=flowunit flowunit=video_encoder device=cpu deviceid=\"0\" encoder=mpeg4 format=mp4 default_dest_url=\"/tmp/car_detection_result.mp4\" label=\"{{<in_video_frame> in_video_frame}|videoencoder}\" ]\n\n    video_input:out_video_url -> videodemuxer:in_video_url\n    videodemuxer:\"out_video_packet\" -> videodecoder:\"in_video_packet\"\n    videodecoder:\"out_video_frame\" -> image_resize:\"in_image\"\n    image_resize:\"out_image\" -> image_transpose:\"in_image\"\n    image_transpose:out_image -> normalize:in_data\n    normalize:out_data -> model_inference:input\n    model_inference:output -> yolox_post:in_feat\n    videodecoder:\"out_video_frame\" -> yolox_post:\"in_image\"\n    yolox_post:out_data -> videoencoder:in_video_frame\n}",

  "nodes": {
    "video_input": {
      "locations": [
        {
          "start": {
            "offset": 53,
            "line": 3,
            "column": 5
          },
          "end": {
            "offset": 230,
            "line": 3,
            "column": 182
          }
        },
        {
          "start": {
            "offset": 1676,
            "line": 13,
            "column": 5
          },
          "end": {
            "offset": 1701,
            "line": 13,
            "column": 30
          }
        }
      ],
      "attributes": {
        "type": "flowunit",
        "flowunit": "video_input",
        "device": "cpu",
        "deviceid": "0",
        "source_url": "@DEMO_VIDEO_DIR@/car_test_video.mp4",
        "label": "{video_input|{<out_video_url> out_video_url}}"
      }
    },
    "image_transpose": {
      "locations": [
        {
          "start": {
            "offset": 805,
            "line": 7,
            "column": 5
          },
          "end": {
            "offset": 967,
            "line": 7,
            "column": 167
          }
        },
        {
          "start": {
            "offset": 1895,
            "line": 16,
            "column": 33
          },
          "end": {
            "offset": 1921,
            "line": 16,
            "column": 59
          }
        },
        {
          "start": {
            "offset": 1926,
            "line": 17,
            "column": 5
          },
          "end": {
            "offset": 1951,
            "line": 17,
            "column": 30
          }
        }
      ],
      "attributes": {
        "type": "flowunit",
        "flowunit": "packed_planar_transpose",
        "device": "cpu",
        "deviceid": "0",
        "label": "{{<in_image> in_image}|image_transpose|{<out_image> out_image}}"
      }
    },
    "normalize": {
      "locations": [
        {
          "start": {
            "offset": 972,
            "line": 8,
            "column": 5
          },
          "end": {
            "offset": 1139,
            "line": 8,
            "column": 172
          }
        },
        {
          "start": {
            "offset": 1955,
            "line": 17,
            "column": 34
          },
          "end": {
            "offset": 1972,
            "line": 17,
            "column": 51
          }
        },
        {
          "start": {
            "offset": 1977,
            "line": 18,
            "column": 5
          },
          "end": {
            "offset": 1995,
            "line": 18,
            "column": 23
          }
        }
      ],
      "attributes": {
        "type": "flowunit",
        "flowunit": "normalize",
        "device": "cpu",
        "deviceid": "0",
        "standard_deviation_inverse": "1,1,1",
        "label": "{{<in_data> in_data}|normalize|{<out_data> out_data}}"
      }
    },
    "model_inference": {
      "locations": [
        {
          "start": {
            "offset": 1144,
            "line": 9,
            "column": 5
          },
          "end": {
            "offset": 1297,
            "line": 9,
            "column": 158
          }
        },
        {
          "start": {
            "offset": 1999,
            "line": 18,
            "column": 27
          },
          "end": {
            "offset": 2020,
            "line": 18,
            "column": 48
          }
        },
        {
          "start": {
            "offset": 2025,
            "line": 19,
            "column": 5
          },
          "end": {
            "offset": 2047,
            "line": 19,
            "column": 27
          }
        }
      ],
      "attributes": {
        "type": "flowunit",
        "flowunit": "car_detect",
        "device": "cuda",
        "deviceid": "0",
        "batch_size": "1",
        "label": "{{<input> input}|model_inference|{<output> output}}"
      }
    },
  },
  "numDeletedComponents": 0,
  "index": 2186,
  "skippableIndex": 2186,
  "erasedIndex": 1462,
  "numErased": 0,
  "str": "digraph car_detection { node [shape=Mrecord] video_input [type=flowunit flowunit=video_input device=cpu deviceid=\"0\" source_url=\"@DEMO_VIDEO_DIR@/car_test_video.mp4\" label=\"{video_input|{<out_video_url> out_video_url}}\"] videodemuxer [type=flowunit flowunit=video_demuxer device=cpu deviceid=\"0\" label=\"{{<in_video_url> in_video_url}|videodemuxer|{<out_video_packet> out_video_packet}}\"] videodecoder [type=flowunit flowunit=video_decoder device=cpu deviceid=\"0\" pix_fmt=bgr label=\"{{<in_video_packet> in_video_packet}|videodecoder|{<out_video_frame> out_video_frame}}\"] image_resize [type=flowunit flowunit=resize device=cpu deviceid=\"0\" image_width=\"512\" image_height=\"288\" interpolation=inter_linear label=\"{{<in_image> in_image}|image_resize|{<out_image> out_image}}\"] image_transpose [type=flowunit flowunit=packed_planar_transpose device=cpu deviceid=\"0\" label=\"{{<in_image> in_image}|image_transpose|{<out_image> out_image}}\"] normalize [type=flowunit flowunit=normalize device=cpu deviceid=\"0\" standard_deviation_inverse=\"1,1,1\" label=\"{{<in_data> in_data}|normalize|{<out_data> out_data}}\"] model_inference [type=flowunit flowunit=car_detect device=cuda deviceid=\"0\" batch_size=\"1\" label=\"{{<input> input}|model_inference|{<output> output}}\"] yolox_post [type=flowunit flowunit=yolox_post device=cpu deviceid=\"0\" label=\"{{<in_image> in_image|<in_feat> in_feat}|yolox_post|{<out_data> out_data}}\"] videoencoder [type=flowunit flowunit=video_encoder device=cpu deviceid=\"0\" encoder=mpeg4 format=mp4 default_dest_url=\"/tmp/car_detection_result.mp4\" label=\"{{<in_video_frame> in_video_frame}|videoencoder}\"] video_input:out_video_url -> videodemuxer:in_video_url videodemuxer:out_video_packet -> videodecoder:in_video_packet videodecoder:out_video_frame -> image_resize:in_image image_resize:out_image -> image_transpose:in_image image_transpose:out_image -> normalize:in_data normalize:out_data -> model_inference:input model_inference:output -> yolox_post:in_feat videodecoder:out_video_frame -> yolox_post:in_image yolox_post:out_data -> videoencoder:in_video_frame}"
}
