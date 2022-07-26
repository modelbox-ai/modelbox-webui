export let context_target = {
  "descryption": "An OpenCV crop flowunit on cpu.",
  "group": "Image",
  "inputports": [
    {
      "name": "in_image"
    },
    {
      "name": "in_region"
    }
  ],
  "name": "crop",
  "options": [],
  "outputports": [
    {
      "name": "out_image"
    }
  ],
  "type": "cpu",
  "version": "1.0.0",
  "virtual": false,
  "title": "crop",
  "active": false,
  "types": [
    "cpu",
    "cuda"
  ]
}

export let context_example = {
  "descryption": "\n\t@Brief: draw a rectangle area on the input image. \n\t@Port parameter: The input port 'in_image' and the output port 'out_image' buffer type are image. \n\t  The image type buffer contain the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t  The other input port 'in_region' buffer type is yolo boundingbox, the memory arrangement is [float x,float y,float w,float h,int32_t condition,float score].\n\t@Constraint: This flowunit can be only used follow the flowunit yolov3 postprocess'.",
}

export let nodeShapeCategories = [
  {
    "title": "Image",
    "collapsed": true,
    "children": [
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
        "virtual": false,
        "title": "buff_meta_mapping",
        "active": true,
        "types": [
          "cpu"
        ]
      }
    ]
  },
  {
    "title": "Input",
    "collapsed": true,
    "children": [
      {
        "descryption": "\n\t@Brief: The operator can generator test data source config for data_source_parser. \n\t@Port parameter:  The output port buffer data indicate data source config. \n\t@Constraint: This flowunit is usually followed by 'data_source_parser'.",
        "group": "Input",
        "inputports": [],
        "name": "data_source_generator",
        "options": [],
        "outputports": [
          {
            "name": "out_data"
          }
        ],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "data_source_generator",
        "active": false,
        "types": [
          "cpu"
        ]
      }
    ]
  },
  {
    "title": "Output",
    "collapsed": true,
    "children": [
      {
        "descryption": "\n\t@Brief: Send reply when receive a response info.flowunit.\n\t@Port parameter: The input port buffer contain the following meta fields:\n\t\tField Name: status,        Type: int32_t\n\t\tField Name: headers,       Type: map<string,string>\n\t  The the input port buffer data type is char * .\n\t@Constraint: The flowuint 'httpserver_sync_reply' must be used pair with 'httpserver_sync_receive'.",
        "group": "Output",
        "inputports": [
          {
            "name": "in_reply_info"
          }
        ],
        "name": "httpserver_sync_reply",
        "options": [],
        "outputports": [],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "httpserver_sync_reply",
        "active": false,
        "types": [
          "cpu"
        ]
      }
    ]
  },
  {
    "title": "Video",
    "collapsed": true,
    "children": [
      {
        "descryption": "\n\t@Brief: A video decoder on cpu. \n\t@Port parameter: The input port buffer type is video_packet, the output port buffer type is video_frame.\n\t  The video_packet buffer contain the following meta fields:\n\t\tField Name: pts,           Type: int64_t\n\t\tField Name: dts,           Type: int64_t\n\t\tField Name: rate_num,      Type: int32_t\n\t\tField Name: rate_den,      Type: int32_t\n\t\tField Name: duration,      Type: int64_t\n\t\tField Name: time_base,     Type: double\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t  The video_frame buffer contain the following meta fields:\n\t\tField Name: index,         Type: int64_t\n\t\tField Name: rate_num,      Type: int32_t\n\t\tField Name: rate_den,      Type: int32_t\n\t\tField Name: duration,      Type: int64_t\n\t\tField Name: url,           Type: string\n\t\tField Name: timestamp,     Type: int64_t\n\t\tField Name: eos,           Type: bool\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: The flowuint 'video_decoder' must be used pair with 'video_demuxer. the output buffer meta fields 'pix_fmt' is 'brg_packed' or 'rgb_packed', 'layout' is 'hcw'.",
        "group": "Video",
        "inputports": [
          {
            "name": "in_video_packet"
          }
        ],
        "name": "video_decoder",
        "options": [
          {
            "default": "0",
            "desc": "the decoder pixel format",
            "name": "pix_fmt",
            "required": true,
            "type": "list",
            "values": {
              "bgr": "bgr",
              "nv12": "nv12",
              "rgb": "rgb"
            }
          }
        ],
        "outputports": [
          {
            "name": "out_video_frame"
          }
        ],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "video_decoder",
        "active": false,
        "types": [
          "cpu"
        ]
      }
    ]
  },
  {
    "title": "Generic",
    "collapsed": true,
    "children": [
      {
        "descryption": "",
        "group": "Generic",
        "inputports": [
          {
            "name": "in_image"
          },
          {
            "name": "in_feat"
          }
        ],
        "name": "yolox_post",
        "options": [],
        "outputports": [
          {
            "name": "out_data"
          }
        ],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "yolox_post",
        "active": false,
        "types": [
          "cpu"
        ]
      }
    ]
  },
  {
    "title": "Virtual",
    "collapsed": true,
    "children": [
      {
        "descryption": "",
        "group": "Virtual",
        "name": "Input",
        "title": "Input",
        "type": "Input",
        "types": [
          "Input"
        ],
        "version": "",
        "virtual": true,
        "active": false
      }
    ]
  }
]
