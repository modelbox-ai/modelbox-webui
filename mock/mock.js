const units = require('./units.json');
const createTasks = require('./createTask.data.json');
const tasksAll = require('./all.tasks.list.data.json');
const deleteData = require('./delete.data.json');
const searchTaskStatus = require('./search.task.status.data.json');
const managementData = [{
  firstName: "aa",
  status: "stop",
  age: 18,
  balance: true
}, {
  firstName: "aa",
  status: "running",
  age: 19,
  balance: true
}]
const taskListData = [{
  name: '?1'
}, {
  name: '?3'
}, {
  name: '?2'
}];

module.exports = {
  'GET /console/rest/quotas': (original, response) => {
    const serviceQuotaList = {
      serviceIds: [
        'vpc',
        'ims',
        'ess',
        'cae',
        'ces',
        'elb',
        'rds',
        'dns',
        'dcs',
        'dms',
        'CCE',
        'workspace',
        'projectman',
        'codehub',
        'testman',
        'codecheck',
        'codeci',
        'releaseman',
        'iam',
        'ccs',
        'kms',
        'dis',
        'dws',
        'csbs',
        'tms',
        'cdn',
        'sfs',
      ],
    };
    response(200, 'success', serviceQuotaList, {});
  },
  'GET /editor/flow-info': (original, response) => {
    response(200, 'success', units, {});
  },
  'GET /console/rest/managementData': (original, response) => {
    response(200, 'success', managementData, {});
  },
  'GET /console/rest/taskListData': (original, response) => {
    response(200, 'success', taskListData, {});
  },
  'POST /console/rest/createTask': (original, response) => {
    response(200, 'success', {}, {});
  },
  // 创建任务
  'PUT /v1/modelbox/job': (original, response) => {
    response(200, 'success', createTasks, {})
  },
  // 查询所有任务
  'GET /v1/modelbox/job/list/all': (original, response) => {
    response(200, 'success', tasksAll, {})
  },
  // 删除任务
  'DELETE /v1/modelbox/job/list/{job_id}': (original, response) => {
    response(200, 'success', deleteData, {})
  },
  // 查询任务状态
  'GET /v1/modelbox/job/{job_id}': (original, response) => {
    response(200, 'success', searchTaskStatus, {})
  },
};

