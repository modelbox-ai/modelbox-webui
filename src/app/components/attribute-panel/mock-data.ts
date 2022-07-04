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
  "name": "httpserver_sync_receive"
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
