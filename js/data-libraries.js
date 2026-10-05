/* ===== 第三方库速查（单独维护，不与核心语法混在一起） =====
 * 对应《Python 3 语法完全指南》第 21 层；核心语法见 data-course.js（第 1—6、8 层）
 * 与 data-cheatsheet-adv.js（第 7、9—20 层）。
 * 库生态变化快：更新本文件只需重新核对本文件，无需牵动核心语法内容。
 * 选库按四要素：适用场景 / 入门门槛 / 维护状态 / 官方文档，不以下载量为依据。
 */
const LIB_META = {
  checked: "2026-09",
  doc: "https://pypi.org/",
};

const LIB_LAYER = {
  layer: "第二十一层 · 常用第三方库速查",
  stage: "库",
  topics: [
    {
      id: "21_0", title: "选库原则与下载量口径", desc: "先看这节再用后面的表",
      html: `<ul>
<li>选库三原则：① 先看标准库有没有（§6.4）；② 看是否主流与维护活跃度；③ 装上后锁定版本进 requirements.txt</li>
<li>⚠️ 本速查不收录下载量：数字易过时且含 CI/依赖传递噪声；下载量高 ≠ 适合新手，选型看维护状态与文档质量</li>
<li>标 🔶 的库（langchain、torch、celery 等）新手请暂缓</li>
<li>安装统一 <code>pip install 库名</code>；安装名 ≠ 导入名会单独注明</li></ul>`,
    },
    {
      id: "21_1", title: "§21.1 网络请求", desc: "requests / httpx / aiohttp",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>requests</td><td>最经典的同步 HTTP 客户端，新手首选</td></tr>
<tr><td>httpx</td><td>现代替代：API 一致，支持异步和 HTTP/2</td></tr>
<tr><td>aiohttp</td><td>老牌异步 HTTP 客户端/服务端</td></tr>
<tr><td>urllib3</td><td>requests 的底层连接池，一般被依赖而非直接用</td></tr></table>`,
    },
    {
      id: "21_2", title: "§21.2 网页解析与爬虫辅助", desc: "bs4 / lxml / playwright 等",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>beautifulsoup4（导入名 bs4）</td><td>HTML 解析新手首选：soup.select("选择器")</td></tr>
<tr><td>lxml</td><td>C 加速的 HTML/XML 解析，更快</td></tr>
<tr><td>playwright</td><td>浏览器自动化新首选：动态网页、截图</td></tr>
<tr><td>selenium</td><td>老牌浏览器自动化</td></tr>
<tr><td>curl-cffi</td><td>模拟浏览器指纹（反爬场景）</td></tr>
<tr><td>feedparser</td><td>解析 RSS/Atom</td></tr></table>`,
    },
    {
      id: "21_3", title: "§21.3 数据处理与科学计算", desc: "pandas / numpy / polars",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>pandas</td><td>表格数据分析的事实标准（DataFrame）</td></tr>
<tr><td>numpy</td><td>多维数组与数值计算底座</td></tr>
<tr><td>polars</td><td>Rust 写的新一代 DataFrame，更快</td></tr>
<tr><td>pyarrow</td><td>列式数据交换（Parquet、大数据互通）</td></tr>
<tr><td>scipy</td><td>科学计算（优化/插值/统计）</td></tr></table>`,
    },
    {
      id: "21_4", title: "§21.4 数据可视化", desc: "matplotlib / seaborn / plotly",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>matplotlib</td><td>绘图基石，pandas .plot() 的底层</td></tr>
<tr><td>seaborn</td><td>基于 matplotlib 的统计绘图，默认样式更好看</td></tr>
<tr><td>plotly</td><td>交互式图表（可缩放悬停）</td></tr>
<tr><td>pyecharts</td><td>百度 ECharts 的 Python 版，中文友好</td></tr></table>`,
    },
    {
      id: "21_5", title: "§21.5 办公文件", desc: "Excel / Word / PDF / PPT 全家桶",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>openpyxl</td><td>Excel .xlsx 读写（精细控制）</td></tr>
<tr><td>xlsxwriter</td><td>只写 Excel：快、图表/格式强</td></tr>
<tr><td>python-docx</td><td>Word .docx 读写</td></tr>
<tr><td>python-pptx</td><td>PPT .pptx 读写</td></tr>
<tr><td>pypdf</td><td>PDF 合并/拆分/提取（纯 Python）</td></tr>
<tr><td>pdfplumber</td><td>PDF 文字与表格提取更准</td></tr>
<tr><td>pymupdf（导入名 fitz）</td><td>高性能 PDF 处理，还能转图片</td></tr>
<tr><td>reportlab / fpdf2</td><td>从零生成 PDF 报告</td></tr>
<tr><td>tabulate / prettytable</td><td>列表数据打印成整齐文本表格</td></tr></table>`,
    },
    {
      id: "21_6", title: "§21.6 Web 开发", desc: "fastapi / flask / django / pydantic",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>fastapi</td><td>现代 API 框架：注解驱动，自动文档</td></tr>
<tr><td>uvicorn</td><td>FastAPI 常用的 ASGI 服务器</td></tr>
<tr><td>flask</td><td>老牌微框架，简单直觉，新手友好</td></tr>
<tr><td>django</td><td>大而全：后台/ORM/账号体系</td></tr>
<tr><td>jinja2</td><td>模板引擎</td></tr>
<tr><td>pydantic</td><td>用注解做运行时数据校验</td></tr>
<tr><td>sqlalchemy</td><td>数据库 ORM 标准</td></tr></table>`,
    },
    {
      id: "21_7", title: "§21.7 数据库客户端", desc: "sqlite3 标准库 + 各数据库",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>sqlite3（标准库）</td><td>零安装单文件数据库，小项目首选</td></tr>
<tr><td>redis</td><td>Redis 客户端（缓存/队列）</td></tr>
<tr><td>pymongo</td><td>MongoDB 客户端</td></tr>
<tr><td>psycopg / psycopg2-binary</td><td>PostgreSQL 客户端</td></tr>
<tr><td>pymysql</td><td>MySQL 纯 Python 客户端</td></tr>
<tr><td>duckdb</td><td>嵌入式分析库，直接查 CSV/Parquet</td></tr></table>`,
    },
    {
      id: "21_8", title: "§21.8 命令行与终端美化", desc: "click / typer / rich / tqdm",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>click</td><td>装饰器风格 CLI 框架</td></tr>
<tr><td>typer</td><td>用类型注解写 CLI，新手最推荐</td></tr>
<tr><td>rich</td><td>终端彩色输出、表格、Markdown 渲染</td></tr>
<tr><td>tqdm</td><td>一行 tqdm(可迭代) 加进度条</td></tr>
<tr><td>textual</td><td>终端里的完整界面框架（TUI）</td></tr></table>`,
    },
    {
      id: "21_9", title: "§21.9 图像与多媒体", desc: "pillow / qrcode / opencv",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>pillow（导入名 PIL）</td><td>图像处理基石：缩放/裁切/水印</td></tr>
<tr><td>qrcode</td><td>两行生成二维码</td></tr>
<tr><td>opencv-python（导入名 cv2）</td><td>计算机视觉</td></tr>
<tr><td>moviepy</td><td>用代码剪视频</td></tr>
<tr><td>pyttsx3 / edge-tts</td><td>文字转语音</td></tr></table>`,
    },
    {
      id: "21_10", title: "§21.10 AI 与大模型", desc: "openai / anthropic / litellm",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>openai</td><td>OpenAI 官方 SDK（也兼容众多国产模型接口）</td></tr>
<tr><td>anthropic</td><td>Claude 官方 SDK</td></tr>
<tr><td>google-genai</td><td>Google Gemini 官方 SDK</td></tr>
<tr><td>litellm</td><td>统一接口调 100+ 家模型，换模型不改代码</td></tr>
<tr><td>🔶 langchain / langgraph</td><td>大模型应用编排（新手暂缓）</td></tr>
<tr><td>tiktoken</td><td>OpenAI 分词器，算 token 用量</td></tr>
<tr><td>🔶 transformers / torch</td><td>本地跑开源模型（重量级，后期再看）</td></tr></table>`,
    },
    {
      id: "21_11", title: "§21.11 机器学习（了解）", desc: "scikit-learn / xgboost",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>scikit-learn</td><td>传统机器学习首选：分类/回归/聚类，API 统一</td></tr>
<tr><td>xgboost / lightgbm</td><td>表格类竞赛常用算法</td></tr></table>
<p>入门后期再深入；先把 Python 基础打牢。</p>`,
    },
    {
      id: "21_12", title: "§21.12 测试与代码质量", desc: "pytest / faker / ruff / mypy",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>pytest</td><td>测试框架事实标准</td></tr>
<tr><td>faker</td><td>生成逼真假数据（姓名/地址/电话）</td></tr>
<tr><td>hypothesis</td><td>属性测试：自动找让代码崩溃的输入</td></tr>
<tr><td>responses / requests-mock</td><td>测试时 mock 掉 HTTP 请求</td></tr>
<tr><td>ruff</td><td>极速代码检查 + 格式化</td></tr>
<tr><td>mypy</td><td>静态类型检查</td></tr></table>`,
    },
    {
      id: "21_13", title: "§21.13 实用小工具", desc: "高频效率工具",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>python-dotenv</td><td>从 .env 读环境变量</td></tr>
<tr><td>pyyaml</td><td>YAML 配置文件读写</td></tr>
<tr><td>python-dateutil</td><td>解析各种写法的日期字符串，如 parse("Sep 30, 2026 3pm")</td></tr>
<tr><td>pendulum / arrow</td><td>更好用的日期时间库</td></tr>
<tr><td>loguru</td><td>一行即用的日志（logging 的省心替代）</td></tr>
<tr><td>tenacity</td><td>一行装饰器加自动重试（调 API 必备）</td></tr>
<tr><td>more-itertools</td><td>itertools 补充包：分块、去重保序</td></tr>
<tr><td>regex</td><td>标准库 re 的增强版</td></tr>
<tr><td>rapidfuzz</td><td>模糊字符串匹配</td></tr>
<tr><td>jieba</td><td>中文分词</td></tr>
<tr><td>psutil</td><td>查 CPU/内存/磁盘/进程</td></tr>
<tr><td>watchdog</td><td>监听文件夹变化</td></tr>
<tr><td>pyperclip</td><td>读写系统剪贴板</td></tr>
<tr><td>send2trash</td><td>删除进回收站（比 os.remove 安全）</td></tr></table>`,
    },
    {
      id: "21_14", title: "§21.14 调度与部署", desc: "apscheduler / pyinstaller / uv",
      html: `<table><tr><th>库</th><th>用途</th></tr>
<tr><td>apscheduler</td><td>功能完整的任务调度（cron 式/间隔/日期）</td></tr>
<tr><td>schedule</td><td>最轻量定时：every().day.at("09:00")</td></tr>
<tr><td>🔶 celery</td><td>分布式任务队列（大型异步任务，后期再看）</td></tr>
<tr><td>pyinstaller</td><td>打包成独立 exe</td></tr>
<tr><td>uv</td><td>Rust 写的极速包管理器，可替代 pip / venv / pip-tools</td></tr>
<tr><td>docker</td><td>用 Python 操控 Docker 容器</td></tr></table>
<p><b>上手口诀</b>：① python -m venv .venv ② 激活 ③ pip install 需要的库 ④ pip freeze &gt; requirements.txt</p>`,
    },
  ],
};
