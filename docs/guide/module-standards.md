---
title: 模块封装规范
description:
---

## 为什么封装？
在开源盛行的今天，我们没有必要也“几乎”不可能造所有的轮子。
开源界有很多优秀的项目可供挑选，使用开源项目可以极大地降低开发成本、快速地提升开发效率，但天下没有免费的午餐，使用开源项目的同时也带来很多问题：

1. 用法差异大、用法复杂，无法快速上手
2. 错误处理、日志输出、指标上报、配置加载支持程度不同
3. 功能集合过大，如不加约束的使用，无法统一用法
4. 质量参差不齐，如不加约束的引用，类库的缺陷就会不受限的在组织内传导，修复的成本非常高
5. 未遵守版本规范，到底用哪个版本？
6. 相同功能多个项目，到底选哪个？
7. 直接使用，替换成本高

## 怎么封装？
因此对于引入的常用的、重要的开源类库，我们需进行统一封装，尽量减少直接引用开源软件。封装规范如下:

1. 实现配置注册、动静态加载
2. 实现工厂方法，通过 `Config` 构建实例，而不是直接 `New` 创建实例
3. 实现配置动静态加载、指标上报、链路跟踪、统一日志，统一错误等功能
4. 启停功能通过 `Serve`，`Shutdown` 实现，统一由 box application 管理
5. 重要的 type 起别名，避免使用时再 import 开源项目
   1. `type alias: type T = package_xx.T1`
6. 重要的 const、var，func 做绑定，避免使用时再 import 开源项目
   1. `var ErrClosed = package_xx.ErrClosed`
   2. `const Nil = redis.Nil`
   3. `var Func = package_xx.Func`
7. 重要的、性能敏感的模块需编写 Benchmark，了解性能指标
8. 至少提供一个 Test 和 Example
9. 避免使用 `type embedding` ，虽然方便，但将暴露过多细节
10. 模块间依赖使用配置重定向，比如：模块A依赖模块B，在模块A的Config中增加字段指向模块B的配置路径，详情见[RedisCache案例](https://github.com/boxgo/box/blob/next/pkg/cache/rediscache/config.go#L13)

## 模块Layout

我们以 [pkg/client/redis](https://github.com/boxgo/box/tree/next/pkg/client/redis) 为例，介绍一下推荐的模块文件布局方案。

```sh
> tree pkg/client/redis
> pkg/client/redis
> ├── alias.go        // 别名定义
> ├── config.go       // 配置声明、加载
> ├── default.go      // 默认实例及其导出方法
> ├── metric.go       // 指标上报
> ├── redis.go        // 类库封装
> ├── redis_test.go   // 单元测试
> ├── script.go       // 其他文件
> └── testdata        // 测试依赖数据
>     ├── ci.yaml     // GitHub Action依赖配置
>     └── local.yaml  // 开发环境 test 依赖配置
```

## GoLand Live Template
使用GoLand的童鞋可以创建Live Template，通过模版快速生成代码，详情见[Live templates](https://www.jetbrains.com/help/go/using-live-templates.html)。

```go
import (
	"github.com/boxgo/box/pkg/config"
	"github.com/boxgo/box/pkg/logger"
)

type (
	$Type$ struct {
		cfg *Config
	}
)

func new$Type$(c *Config) *$Type$ {
	return &$Type${
		cfg: c,
	}
}


type (
	// Config 配置
	Config struct {
		path string
		Key string
	}

	// OptionFunc 选项信息
	OptionFunc func(*Config)
)

// WithKey 设置选项
func WithKey(x string) OptionFunc {
	return func(options *Config) {
		options.Key = x
	}
}

// StdConfig 标准配置
func StdConfig(key string, optionFunc ...OptionFunc) *Config {
	cfg := DefaultConfig(key)
	for _, fn := range optionFunc {
		fn(cfg)
	}

	if err := config.Scan(cfg); err != nil {
		logger.Panicf("$Type$ load config error: %s", err)
	}

	return cfg
}

// DefaultConfig 默认配置
func DefaultConfig(key string) *Config {
	return &Config{
		path: "$Type$." + key,
	}
}

// Build 构建实例
func (c *Config) Build() *$Type$ {
	return new$Type$(c)
}

// Path 实例配置目录
func (c *Config) Path() string {
	return c.path
}
```