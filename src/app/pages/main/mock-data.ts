export let flow_info = [
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
      },
      {
        "descryption": "\n\t@Brief: An OpenCV crop flowunit on cpu. \n\t@Port parameter: The input port 'in_image' and the output port 'out_image' buffer type are image. \n\t  The image type buffer contain the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t  The other input port 'in_region' buffer type is rectangle, the memory arrangement is [x,y,w,h].\n\t  it contain the following meta fields: \n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: The field value range of this flowunit support: 'pix_fmt': [rgb_packed,bgr_packed], 'layout': [hwc]. One image can only be cropped with one rectangle and output one crop image.",
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
      },
      {
        "descryption": "\n\t@Brief: draw a rectangle area on the input image. \n\t@Port parameter: The input port 'in_image' and the output port 'out_image' buffer type are image. \n\t  The image type buffer contain the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t  The other input port 'in_region' buffer type is yolo boundingbox, the memory arrangement is [float x,float y,float w,float h,int32_t condition,float score].\n\t@Constraint: This flowunit can be only used follow the flowunit yolov3 postprocess'.",
        "group": "Image",
        "inputports": [
          {
            "name": "in_image"
          },
          {
            "name": "in_region"
          }
        ],
        "name": "draw_bbox",
        "options": [],
        "outputports": [
          {
            "name": "out_image"
          }
        ],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "draw_bbox",
        "active": false,
        "types": [
          "cpu"
        ]
      },
      {
        "descryption": "\n\t@Brief: An OpenCV crop flowunit on cpu. \n\t@Port parameter: The input port buffer type is image file binary, the output port buffer type are image. \n\t  The image type buffer contains the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint:",
        "group": "Image",
        "inputports": [
          {
            "name": "in_encoded_image"
          }
        ],
        "name": "image_decoder",
        "options": [
          {
            "default": "bgr",
            "desc": "the output pixel format",
            "name": "pix_fmt",
            "required": true,
            "type": "string"
          }
        ],
        "outputports": [
          {
            "name": "out_image"
          }
        ],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "image_decoder",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: An OpenCV rotate flowunit on cpu. \n\t@Port parameter: The input port buffer type is image file binary, the output port buffer type are image. \n\t  The image type buffer contains the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: rotate_angle,  Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint:",
        "group": "Image",
        "inputports": [
          {
            "name": "in_image"
          }
        ],
        "name": "image_rotate",
        "options": [
          {
            "default": "0",
            "desc": "the image rotate image",
            "name": "rotate_angle",
            "required": false,
            "type": "int"
          }
        ],
        "outputports": [
          {
            "name": "out_image"
          }
        ],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "image_rotate",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: The operator is used to subtract the mean for tensor data, for example the image(RGB/BGR), shape(W, H, C), subtract the corresponding value for different channels. \n\t@Port parameter: The input port and the output buffer type are tensor. \n\t  The tensor type buffer contain the following meta fields:\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: ",
        "group": "Image",
        "inputports": [
          {
            "name": "in_data"
          }
        ],
        "name": "mean",
        "options": [
          {
            "default": "",
            "desc": "the mean param",
            "name": "mean",
            "required": true,
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
        "title": "mean",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: The operator is used to normalize for tensor data, for example the image(RGB/BGR). \n\t@Port parameter: The input port and the output buffer type are tensor. \n\t  The tensor type buffer contain the following meta fields:\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: ",
        "group": "Image",
        "inputports": [
          {
            "name": "in_data"
          }
        ],
        "name": "normalize",
        "options": [
          {
            "default": "",
            "desc": "the normalize param",
            "name": "standard_deviation_inverse",
            "required": true,
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
        "title": "normalize",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: Convert the image format from packed to planar. \n\t@Port parameter: The input port 'in_image' and the output port 'out_image' buffer type are image. \n\t  The image type buffer contain the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: The field value range of this flowunit support: 'pix_fmt': [rgb,bgr], 'layout': [hwc]",
        "group": "Image",
        "inputports": [
          {
            "name": "in_image"
          }
        ],
        "name": "packed_planar_transpose",
        "options": [],
        "outputports": [
          {
            "name": "out_image"
          }
        ],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "packed_planar_transpose",
        "active": false,
        "types": [
          "cpu"
        ]
      },
      {
        "descryption": "\n\t@Brief: A padding flowunit on cpu. \n\t@Port parameter: The input port buffer type and the output port buffer type are image. \n\t  The image type buffer contains the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: The field value range of this flowunit supports: 'pix_fmt': [rgb,bgr], 'layout': [hwc]. ",
        "group": "Image",
        "inputports": [
          {
            "name": "in_image"
          }
        ],
        "name": "padding",
        "options": [
          {
            "default": "0",
            "desc": "Output img width",
            "name": "image_width",
            "required": true,
            "type": "int"
          },
          {
            "default": "0",
            "desc": "Output img height",
            "name": "image_height",
            "required": true,
            "type": "int"
          },
          {
            "default": "top",
            "desc": "Output roi vertical align type",
            "name": "vertical_align",
            "required": false,
            "type": "list",
            "values": {
              "bottom": "bottom",
              "center": "center",
              "top": "top"
            }
          },
          {
            "default": "left",
            "desc": "Output roi horizontal align type",
            "name": "horizontal_align",
            "required": false,
            "type": "list",
            "values": {
              "center": "center",
              "left": "left",
              "right": "right"
            }
          },
          {
            "default": "0,0,0",
            "desc": "Data for padding",
            "name": "padding_data",
            "required": false,
            "type": "string"
          },
          {
            "default": "true",
            "desc": "Will scale roi to fit output image",
            "name": "need_scale",
            "required": false,
            "type": "bool"
          },
          {
            "default": "inter_linear",
            "desc": "Interpolation method to scale roi",
            "name": "interpolation",
            "required": false,
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
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "padding",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: A resize flowunit on cpu. \n\t@Port parameter: The input port buffer type and the output port buffer type are image. \n\t  The image type buffer contains the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: The field value range of this flowunit supports: 'pix_fmt': [rgb_packed,bgr_packed], 'layout': [hwc]. ",
        "group": "Image",
        "inputports": [
          {
            "name": "in_image"
          }
        ],
        "name": "resize",
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
            "desc": "the resize interpolation method",
            "name": "interpolation",
            "required": true,
            "type": "list",
            "values": {
              "inter_area": "inter_area",
              "inter_cubic": "inter_cubic",
              "inter_lanczos4": "inter_lanczos4",
              "inter_linear": "inter_linear",
              "inter_max": "inter_max",
              "inter_nearest": "inter_nearest",
              "warp_fill_outliers": "warp_fill_outliers",
              "warp_inverse_map": "warp_inverse_map"
            }
          }
        ],
        "outputports": [
          {
            "name": "out_image"
          }
        ],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "resize",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: Convert image color space between rgb, bgr, gray .\n\t@Port parameter: The input port buffer type and the output port buffer type are image. \n\t  The image type buffer contains the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: This flowunit support: 'rgb' to 'bgr', 'bgr' to 'rgb', 'rgb' to 'gray', 'bgr' to 'gray', 'gray' to 'bgr', 'gray' to 'rgb'. ",
        "group": "Image",
        "inputports": [
          {
            "name": "in_image"
          }
        ],
        "name": "color_convert",
        "options": [
          {
            "default": "",
            "desc": "the colour transpose output pixel format",
            "name": "out_pix_fmt",
            "required": true,
            "type": "list",
            "values": {
              "bgr": "bgr",
              "gray": "gray",
              "rgb": "rgb"
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
        "title": "color_convert",
        "active": false,
        "types": [
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: A crop flowunit on cuda device. \n\t@Port parameter: The input port 'in_image' and the output port 'out_image' buffer type are image. \n\t  The image type buffer contain the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t  The other input port 'in_region' buffer type is rectangle, the memory arrangement is [x,y,w,h].\n\t  it contain the following meta fields: \n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: The field value range of this flowunit support: 'pix_fmt': [nv12], 'layout': [hwc]. One image can only be cropped with one rectangle and output one crop image.",
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
        "type": "cuda",
        "version": "1.0.0",
        "virtual": false,
        "title": "crop",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: An OpenCV crop flowunit on cpu. \n\t@Port parameter: The input port buffer type is image file binary, the output port buffer type are image. \n\t  The image type buffer contains the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint:",
        "group": "Image",
        "inputports": [
          {
            "name": "in_encoded_image"
          }
        ],
        "name": "image_decoder",
        "options": [
          {
            "default": "bgr",
            "desc": "the imdecode output pixel format",
            "name": "pix_fmt",
            "required": true,
            "type": "list",
            "values": {
              "bgr": "bgr",
              "rgb": "rgb"
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
        "title": "image_decoder",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "",
        "group": "Image",
        "inputports": [
          {
            "name": "in_image"
          }
        ],
        "name": "image_preprocess",
        "options": [
          {
            "default": "",
            "desc": "the normalize output layout",
            "name": "output_layout",
            "required": true,
            "type": "string"
          },
          {
            "default": "",
            "desc": "the normalize mean",
            "name": "mean",
            "required": false,
            "type": "string"
          },
          {
            "default": "",
            "desc": "the normalize std",
            "name": "standard_deviation_inverse",
            "required": false,
            "type": "string"
          }
        ],
        "outputports": [
          {
            "name": "out_data"
          }
        ],
        "type": "cuda",
        "version": "1.0.0",
        "virtual": false,
        "title": "image_preprocess",
        "active": false,
        "types": [
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: An OpenCV rotate flowunit on cuda. \n\t@Port parameter: The input port buffer type is image file binary, the output port buffer type are image. \n\t  The image type buffer contains the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: rotate_angle,  Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint:",
        "group": "Image",
        "inputports": [
          {
            "name": "in_image"
          }
        ],
        "name": "image_rotate",
        "options": [
          {
            "default": "0",
            "desc": "the image rotate image",
            "name": "rotate_angle",
            "required": false,
            "type": "int"
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
        "title": "image_rotate",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: The operator is used to subtract the mean for tensor data, for example the image(RGB/BGR), shape(W, H, C), subtract the corresponding value for different channels. \n\t@Port parameter: The input port and the output buffer type are tensor. \n\t  The tensor type buffer contain the following meta fields:\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: ",
        "group": "Image",
        "inputports": [
          {
            "name": "in_data"
          }
        ],
        "name": "mean",
        "options": [
          {
            "default": "",
            "desc": "the mean param",
            "name": "mean",
            "required": true,
            "type": "string"
          }
        ],
        "outputports": [
          {
            "name": "out_data"
          }
        ],
        "type": "cuda",
        "version": "1.0.0",
        "virtual": false,
        "title": "mean",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: The operator is used to normalize for tensor data, for example the image(RGB/BGR). \n\t@Port parameter: The input port and the output buffer type are tensor. \n\t  The tensor type buffer contain the following meta fields:\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: ",
        "group": "Image",
        "inputports": [
          {
            "name": "in_data"
          }
        ],
        "name": "normalize",
        "options": [
          {
            "default": "",
            "desc": "the normalize param",
            "name": "standard_deviation_inverse",
            "required": true,
            "type": "string"
          }
        ],
        "outputports": [
          {
            "name": "out_data"
          }
        ],
        "type": "cuda",
        "version": "1.0.0",
        "virtual": false,
        "title": "normalize",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: A padding flowunit on cuda. \n\t@Port parameter: The input port buffer type and the output port buffer type are image. \n\t  The image type buffer contains the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: The field value range of this flowunit supports: 'pix_fmt': [rgb,bgr], 'layout': [hwc]. ",
        "group": "Image",
        "inputports": [
          {
            "name": "in_image"
          }
        ],
        "name": "padding",
        "options": [
          {
            "default": "0",
            "desc": "Output img width",
            "name": "image_width",
            "required": true,
            "type": "int"
          },
          {
            "default": "0",
            "desc": "Output img height",
            "name": "image_height",
            "required": true,
            "type": "int"
          },
          {
            "default": "top",
            "desc": "Output roi vertical align type",
            "name": "vertical_align",
            "required": false,
            "type": "list",
            "values": {
              "bottom": "bottom",
              "center": "center",
              "top": "top"
            }
          },
          {
            "default": "left",
            "desc": "Output roi horizontal align type",
            "name": "horizontal_align",
            "required": false,
            "type": "list",
            "values": {
              "center": "center",
              "left": "left",
              "right": "right"
            }
          },
          {
            "default": "0,0,0",
            "desc": "Data for padding",
            "name": "padding_data",
            "required": false,
            "type": "string"
          },
          {
            "default": "true",
            "desc": "Will scale roi to fit output image",
            "name": "need_scale",
            "required": false,
            "type": "bool"
          },
          {
            "default": "inter_linear",
            "desc": "Interpolation method to scale roi",
            "name": "interpolation",
            "required": false,
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
        "title": "padding",
        "active": false,
        "types": [
          "cpu",
          "cuda"
        ]
      },
      {
        "descryption": "\n\t@Brief: A resize flowunit on cuda device. \n\t@Port parameter: The input port buffer type and the output port buffer type are image. \n\t  The image type buffer contains the following meta fields:\n\t\tField Name: width,         Type: int32_t\n\t\tField Name: height,        Type: int32_t\n\t\tField Name: width_stride,  Type: int32_t\n\t\tField Name: height_stride, Type: int32_t\n\t\tField Name: channel,       Type: int32_t\n\t\tField Name: pix_fmt,       Type: string\n\t\tField Name: layout,        Type: int32_t\n\t\tField Name: shape,         Type: vector<size_t>\n\t\tField Name: type,          Type: ModelBoxDataType::MODELBOX_UINT8\n\t@Constraint: The field value range of this flowunit supports: 'pix_fmt': [rgb_packed,bgr_packed], 'layout': [hwc]. ",
        "group": "Image",
        "inputports": [
          {
            "name": "in_image"
          }
        ],
        "name": "resize",
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
            "name": "input1"
          }
        ],
        "name": "flowunit",
        "options": [],
        "outputports": [],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "flowunit",
        "active": false,
        "types": [
          "cpu"
        ]
      },
      {
        "descryption": "",
        "group": "Generic",
        "inputports": [
          {
            "name": "in_data"
          }
        ],
        "name": "hello_world",
        "options": [],
        "outputports": [
          {
            "name": "out_data"
          }
        ],
        "type": "cpu",
        "version": "1.0.0",
        "virtual": false,
        "title": "hello_world",
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
      },
      {
        "descryption": "",
        "group": "Virtual",
        "name": "Output",
        "title": "Output",
        "type": "Output",
        "types": [
          "Output"
        ],
        "version": "",
        "virtual": true,
        "active": false
      }
    ]
  }
]