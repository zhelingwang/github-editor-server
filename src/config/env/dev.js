module.exports = {
  // 假设将当本项目应用视为docker多容器应用(compose)中的主应用
  // 当主应用作为docker容器应用被运行时, 配置中的 127.0.0.1 / localhost 指代的是容器本身
  // 而容器本身是没有提供这些服务, 所以需要将 host 设置为 docker-compose.yml 中对应服务的名称
  // docker-compose 中定义的服务名可以简单的视为 host 替代, 用于多容器之间的直接通信
  mysqlConf: {},
  redisConf: {
    // host: 'editor-redis',
  },
  mongoConf: {},
};
