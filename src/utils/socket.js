import Stomp from 'stomp';
import SockJS from 'sockjs';
import logger from './logger';
import { str2Obj, obj2Str, deepExtend, isObject, generateUuid } from './index';
import { TokenKey, getToken } from './auth';

import { CONTENT_TYPE } from './constant';
import { assertWarning } from './message';

const CUSTOMER_MESSAGE_TYPE = 100; // 只用在当前文件， 其他再enum里面取
let stompClient;
let subscribeMap = {};
// {
//   broker:{
//     msgType: [func1,func2]
//   }
// }

const SOCKET_URL = process.env.VUE_APP_BASE_API + '/message/ws';
// const SOCKET_URL = 'http://localhost:1800/message/ws';
const PREFIX = '/app';
export const BROKER = {
  TOPIC_ADMIN: '/topic/admin', // cons广播给admin
  TOPIC_ROOM: '/topic/{room}', // cons广播给租户
  USER_P2P: '/user/{uuid}/p2p', // 监听发给自己的P2P消息
  QRCODE_P2P: '/user/{token}/p2p',
  PDF_UPLOAD: '/user/queue/pdf' // 上传pdf文件
};

export const getBroker = uuid => {
  return BROKER.USER_P2P.replace('{uuid}', uuid);
};

export const getQrBroker = token => {
  return BROKER.QRCODE_P2P.replace('{token}', token);
};

export const getTenantBroker = room => {
  return BROKER.TOPIC_ROOM.replace('{room}', room);
};

const devDebug = d => {
  logger.info(d);
};

export const connectStomp = (params = {}) => {
  if (!stompClient) {
    // 第一次创建
    stompClient = Stomp.over(new SockJS(SOCKET_URL));
    stompClient.debug = devDebug;
  } else if (stompClient.connected) {
    // 已经链接
    return Promise.resolve();
  } else {
    // 第二次创建
  }
  return new Promise((resolve, reject) => {
    stompClient.connect(
      {
        [TokenKey]: params.token || getToken()
      },
      resolve,
      reject
    );
  })
    .then(d => {
      logger.info('websocket connected', d);
      return Promise.resolve();
    })
    .catch(() => {
      logger.info('websocket connect failed');
      return Promise.reject('connect failed');
    });
};

export const disconnectStomp = (params = {}) => {
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
  }
};


const resetSubscribeMap = (broker, types, cb) => {
  const msgTypes = Array.isArray(types) ? types : [types];
  if (!cb) {
    assertWarning('请设置回调');
  }
  if (!subscribeMap) subscribeMap = {};
  if (!subscribeMap[broker]) subscribeMap[broker] = {};
  const uuid = generateUuid();
  msgTypes.forEach(t => {
    if (!subscribeMap[broker][t]) subscribeMap[broker][t] = {};
    subscribeMap[broker][t][uuid] = cb;
  });
  return uuid;
};

export const subscribeBroker = (broker, types, cb) => {
  if (!stompClient) {
    return connectStomp().then(_ => {
      subscribeBroker(broker, types, cb);
    });
  }
  const subscribed = !!subscribeMap[broker];
  const cbUuid = resetSubscribeMap(broker, types, cb);
  if (subscribed) return cbUuid;
  stompClient.subscribe(broker, payload => {
    const body = str2Obj(payload.body);
    if (body.contentType === CONTENT_TYPE.JSON) {
      body.content = str2Obj(body.content);
    }
    if (!body.type) {
      // 没有设置消息类型， 认为是自定义类型
      body.type = CUSTOMER_MESSAGE_TYPE;
    }
    const funcMap = subscribeMap[broker][body.type];
    Object.values(funcMap).forEach(func => func(body));
  });
  return cbUuid;
};

export const unsubscribeBroker = (broker, types, cbUuid) => {
  const msgMap = subscribeMap[broker];
  if (!msgMap) return;

  const msgTypes = Array.isArray(types) ? types : [types];
  for (let i = msgTypes.length - 1; i >= 0; i--) {
    const mt = msgTypes[i];
    const funcMap = msgMap[mt];
    if (!funcMap) {
      delete msgMap[mt];
      continue;
    }
    delete funcMap[cbUuid];
    if (Object.keys(funcMap).length === 0) {
      // 删除func
      delete msgMap[mt];
    }
  }
  if (Object.keys(msgMap).length === 0) {
    // 删除broker
    delete subscribeMap[broker];
  }
};

export const sendMessage = (broker, body) => {
  const msgBody = {
    identification: null,
    from: null,
    to: null,
    type: null,
    content: null,
    contentType: null
  };
  if (typeof body === 'string') {
    msgBody.content = body;
    msgBody.contentType = CONTENT_TYPE.TEXT;
  } else if (Array.isArray(body)) {
    msgBody.contentType = CONTENT_TYPE.JSON;
  } else if (isObject(body)) {
    deepExtend(msgBody, body);
  } else {
    throw new Error('消息体不正确');
  }
  msgBody.content = obj2Str(msgBody.content);
  stompClient.send(`${PREFIX}${broker}`, {}, obj2Str(msgBody));
};
