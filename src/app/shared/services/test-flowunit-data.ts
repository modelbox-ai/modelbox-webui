export let test_flowunits_data = [
  {
    "base": {
      "description": "Recognition handwritten digits recognition.",
      "device": "cpu",
      "entry": "./mnist_model.pb",
      "name": "mnist_infer",
      "type": "inference",
      "version": "1.0.0",
      "virtual_type": "tensorflow"
    },
    "input": {
      "input1": {
        "name": "Input",
        "type": "float"
      }
    },
    "output": {
      "output1": {
        "name": "Output",
        "type": "float"
      }
    }
  },
  {
    "base": {
      "collapse": false,
      "collapse_all": false,
      "condition": false,
      "description": "mnist preprocess",
      "device": "cpu",
      "entry": "mnist_preprocess@MnistPreprocess",
      "expand": false,
      "name": "mnist_preprocess",
      "stream": false,
      "type": "python",
      "version": "1.0.0"
    },
    "config": {},
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
];

export let test_transformed_data = [
  {
    "descryption": "Recognition handwritten digits recognition.",
    "group": "Generic",
    "name": "mnist_infer",
    "version": "1.0.0",
    "type": "cpu",
    "inputports": [
      {
        "name": "Input",
        "type": "float"
      }
    ],
    "outputports": [
      {
        "name": "Output",
        "type": "float"
      }
    ]
  },
  {
    "descryption": "mnist preprocess",
    "group": "Generic",
    "name": "mnist_preprocess",
    "version": "1.0.0",
    "type": "cpu",
    "inputports": [
      {
        "name": "in_data"
      }
    ],
    "outputports": [
      {
        "name": "out_data"
      }
    ]
  }
];