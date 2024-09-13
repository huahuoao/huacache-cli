let ipAddress = 'localhost'; // 默认的 IP 地址
let port = '4160'; // 默认的端口

export const setIPAddress = (newIP) => {
  ipAddress = newIP;
};

export const getIPAddress = () => {
  return ipAddress;
};

export const setPort = (newPort) => {
  port = newPort;
};

export const getPort = () => {
  return port;
};

export const getBaseURL = () => {
  return `http://${ipAddress}:${port}`;
};
