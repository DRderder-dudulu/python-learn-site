/* ===== 项目实战数据 =====
 * 第三方库选型四要素：适用场景 / 入门门槛 / 维护状态 / 官方文档链接。
 * 不使用下载量作为推荐依据；维护状态与链接单独定期核对（最后核对：2026-09）。
 */
const PROJECTS = [
  {
    id: 1, title: "下载文件夹整理器",
    unlock: "学完第三层解锁", skills: "pathlib、shutil、循环、字典",
    brief: "遍历下载目录，把图片/文档/压缩包按类型自动移动到子文件夹。",
    scene: "个人文件批处理、定时整理",
    level: "低（纯标准库，零安装）",
    maintenance: "标准库，随 Python 版本持续维护",
    doc: "https://docs.python.org/zh-cn/3.14/library/pathlib.html",
  },
  {
    id: 2, title: "成绩分析器",
    unlock: "学完第三层解锁", skills: "csv、字典、排序",
    brief: "读取 CSV 成绩表，输出每科平均分和总分排名。",
    scene: "表格数据统计的入门场景",
    level: "低（纯标准库，零安装）",
    maintenance: "标准库，随 Python 版本持续维护",
    doc: "https://docs.python.org/zh-cn/3.14/library/csv.html",
  },
  {
    id: 3, title: "Excel 合并机器人",
    unlock: "进阶（pip install openpyxl）", skills: "openpyxl、glob",
    brief: "把一个目录里所有 .xlsx 报表合并成一张总表。",
    scene: "办公报表自动化（财务/人事高频）",
    level: "低（API 直观，文档示例丰富）",
    maintenance: "活跃，近年持续发布新版本",
    doc: "https://openpyxl.readthedocs.io/",
  },
  {
    id: 4, title: "天气推送小爬虫",
    unlock: "进阶（pip install requests，需自行申请 API key）", skills: "requests、JSON、定时",
    brief: "调用天气 API 取数据，定时推送到群机器人 webhook。",
    scene: "公开 API 调用 + 消息通知",
    level: "低-中（需理解 HTTP 与 API key）",
    maintenance: "活跃，成熟稳定",
    doc: "https://requests.readthedocs.io/",
  },
  {
    id: 5, title: "个人记账 CLI",
    unlock: "进阶（pip install typer）", skills: "typer、文件读写、JSON",
    brief: "命令行记账工具：add / list / stat 子命令，JSON 文件存储。",
    scene: "把脚本升级为命令行工具",
    level: "低-中（装饰器 + 类型注解，需第二阶段知识）",
    maintenance: "活跃（FastAPI 同作者）",
    doc: "https://typer.tiangolo.com/",
  },
  {
    id: 6, title: "FastAPI 待办接口",
    unlock: "毕业项目（需第二阶段知识）", skills: "fastapi、类型注解、uvicorn",
    brief: "待办事项后端：增删改查 + 自动生成的接口文档。",
    scene: "Web API 后端入门",
    level: "中（需装饰器与类型注解基础）",
    maintenance: "非常活跃，社区生态大",
    doc: "https://fastapi.tiangolo.com/zh/",
  },
];
