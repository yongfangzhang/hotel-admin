const DEV = process.env.NODE_ENV === 'development';
export const LOG_COLOR = {
  GREEN: 'green',
  BLUE: 'blue',
  RED: 'red',
  YELLOW: 'yellow'
};

const getFileInfo = () => {
  try {
    throw new Error('');
  } catch (ex) {
    const from = ex.stack.split('\n')[3];
    const reg = /at\s(.*?)\s\(.*\/(.*?\..*?):(\d+:\d+)/g;
    const groups = reg.exec(from);
    if (!groups || groups.length < 4) return [];
    return [`%c[${groups[2]}--${groups[1]}]`, 'color: green'];
  }
};

const groupConsole = (groupName, params) => {
  console.group(groupName);
  console.info(...params);
  console.groupEnd();
};

export default {
  debug(...params) {
    if (!DEV) return;
    // console.log(...getFileInfo().concat(params));
    console.trace(params);
  },
  groupInfo(groupName, ...params) {
    if (!DEV) return;
    groupConsole(groupName, params);
  },
  info(...params) {
    if (!DEV) return;
    console.info(...getFileInfo().concat(params));
  },
  error(...params) {
    if (!DEV) return;
    console.error(...getFileInfo().concat(params));
  },
  fmt(content) {
    if (typeof content === 'string') return content;
    return JSON.stringify(content);
  },
  cError(content) {
    if (!DEV) return;
    console.error(this.fmt(content));
  },
  cInfo(content, color) {
    if (!DEV) return;
    console.log(
      '%c ' + this.fmt(content),
      `color: ${color || LOG_COLOR.GREEN}`
    );
  },
  cWarn(content, color) {
    if (!DEV) return;
    console.log(
      '%c ' + this.fmt(content),
      `color: ${color || LOG_COLOR.YELLOW}`
    );
  },
  cDebug(content) {
    if (!DEV) return;
    console.log(content);
  }
};
