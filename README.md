# huacache-cli

## 项目启动
```shell
npm install
```

```shell
npm run serve
```

## 项目部署

```shell
git clone https://github.com/huahuoao/huacache-cli
docker pull node:20
docker pull nginx:alpine
docker build -t huacache-cli .
docker run -itd -p 8080:80 huacache-cli
```

