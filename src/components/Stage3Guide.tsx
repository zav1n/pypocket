import { useState } from 'react';
import { CheckCircle2, Circle, Rocket, AlertTriangle } from 'lucide-react';

/* 第三阶段指南：只读页，不判题、不跑代码。
   因为第三阶段需要在自己电脑上做真实网络、真实文件、真实服务器，
   浏览器沙盒里做不完整，所以这里是“照着做的清单”，不是关卡。 */

interface Section {
  id: string;
  icon: string;
  title: string;
  goal: string;
  steps: string[];
  checkpoint: string;
  code?: string;
}

const SECTIONS: Section[] = [
  {
    id: 'env',
    icon: '🛠️',
    title: '第 0 步：本地环境，先把工具链跑通',
    goal: '在自己电脑上能独立建项目、装包、提交代码，而不是只在浏览器里写代码。',
    steps: [
      '装 Python 3.11+，终端跑通 python3 --version 和 pip --version。',
      '新建项目文件夹，建虚拟环境并激活（Mac）：python3 -m venv .venv，然后 source .venv/bin/activate，看到命令行前面出现 (.venv) 就是成功了。',
      '装 VS Code 和 Python 插件；项目里放 .gitignore（忽略 .venv/），用 pip freeze > requirements.txt 记录依赖。',
      '学会 Git 最基本的三件套：git init、git add .、git commit -m "xxx"，能回滚一次就算会了，不用先学分支。',
      '国内装包慢时可用清华镜像：pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple（只是一个下载源，不是必须）。',
    ],
    checkpoint: '新开一个文件夹，不查教程，10 分钟内建好虚拟环境并跑通一个 print("hello")。',
    code: 'python3 -m venv .venv\nsource .venv/bin/activate\npip install requests',
  },
  {
    id: 'spider',
    icon: '🕷️',
    title: '项目 1：真实爬虫（爬虫线真实版）',
    goal: '爬一个真实网站，把数据存成表格，而不是解析一段写好的字符串。',
    steps: [
      '只爬公开、允许练习的网站，例如 quotes.toscrape.com 或 books.toscrape.com。不爬需要登录、付费、个人信息的网站，先看 robots 规则。',
      '用 requests 发请求，拿到 HTML；失败要处理：超时、404、网络断开不能直接崩。',
      '用 BeautifulSoup 解析，提取书名 / 价格 / 评分。',
      '翻页：至少爬 3 页，请求之间加 time.sleep(1)，别对人家服务器狂轰。',
      '存成 books.csv，用 Excel 或 VS Code 打开能看到表格。',
      '加分项：价格排序后输出最贵的前 5 本；把“爬取失败的页”记到日志里而不是丢掉。',
    ],
    checkpoint: '换一个同类练习站，不看旧代码，能自己改选择器爬出来。',
  },
  {
    id: 'backend',
    icon: '🖥️',
    title: '项目 2：真实后端（后端线真实版）',
    goal: '做一个能真正被访问的服务，重启后数据还在。',
    steps: [
      '装 fastapi、uvicorn，写出接口：新增、列表、完成、删除。',
      '数据存在 SQLite 文件里，重启服务后数据还在——这就是第二阶段内存版和真实版最大的区别。',
      '用 uvicorn main:app --reload 跑起来，浏览器打开自动生成的接口文档页，自己点一点测通。',
      '项目结构至少分开：main.py（接口）、database.py（数据库连接）、models.py（数据结构），别把所有代码堆在一个文件里。',
      '加分项：加一个查询参数（比如只看未完成）；给接口加异常处理，传错数据返回清晰的错误而不是崩。',
    ],
    checkpoint: '关掉服务再重启，数据还在；不用教程，能给待办加一个“截止日期”字段并跑通。',
    code: 'pip install fastapi uvicorn\nuvicorn main:app --reload',
  },
  {
    id: 'ai',
    icon: '📊',
    title: '项目 3：真实数据分析（AI 线真实版）',
    goal: '处理一份真实 CSV，而不是写在代码里的字符串。',
    steps: [
      '找一份公开 CSV（比如各城市的公开统计数据，或自己用项目 1 爬到的 books.csv）。',
      '用 pandas 读进来，先做三件事：看前几行、看缺失值、看重复行。',
      '清洗：去掉重复、处理缺失（删除或填平均值，并能说出为什么这样选）。',
      '分组统计：按城市算平均分 / 按类别算平均价格，并排序输出。',
      '用 matplotlib 画一张柱状图并保存成 PNG，能讲出图里最明显的 1 个结论。',
    ],
    checkpoint: '换一份没见过的 CSV，能自己走完“读入 - 清洗 - 分组 - 排序 - 画图”全流程。',
    code: 'pip install pandas matplotlib',
  },
];

const PITFALLS = [
  '虚拟环境没激活就装包：装到了全局，后面换项目全乱套。每次开终端先确认 (.venv)。',
  '端口被占用：FastAPI 起不来先看是不是上次的服务没关，换个端口或关掉旧进程。',
  '爬虫被封 / 返回不对：先看状态码和 robots，别硬刷；加请求头和间隔，频率放慢。',
  'pandas 读 CSV 乱码：先试 encoding="utf-8"，不行再试 gbk，看文件本身是什么编码。',
  '报错先看最后一行：Python 报错最有用的信息通常在最后几行，先读它，再往上找自己写的哪一行。',
];

export default function Stage3Guide() {
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('pypocket-stage3-done') || '{}');
    } catch {
      return {};
    }
  });

  function toggle(id: string) {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    localStorage.setItem('pypocket-stage3-done', JSON.stringify(next));
  }

  const doneCount = SECTIONS.filter((s) => done[s.id]).length;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="font-bold text-lg flex items-center gap-2"><Rocket className="w-5 h-5 text-violet-400" /> 第三阶段指南：从浏览器沙盒到真实世界</h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          这一页是只读指南，没有判题、不用提交——因为第三阶段需要在自己电脑上做真实网络、真实文件、真实服务器，
          浏览器里做不完整。目标只有一个：小白在自己电脑上，能独立装环境、跑真实项目、调真实报错。
          判断标准和前两阶段一样：不看答案，能独立做出来、能自己加功能、能自己调报错，才算过关。
        </p>
        <p className="text-sm mt-2">
          进度：<span className="font-bold text-emerald-400">{doneCount} / {SECTIONS.length}</span> 步已勾选完成（只存在你的浏览器里，换设备不跟着走）
        </p>
      </section>

      {SECTIONS.map((section) => (
        <section key={section.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-start gap-3">
            <button onClick={() => toggle(section.id)} className="shrink-0 mt-0.5" title={done[section.id] ? '标记为未完成' : '标记为已完成'}>
              {done[section.id] ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Circle className="w-6 h-6 text-slate-500" />}
            </button>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold">{section.icon} {section.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{section.goal}</p>
              <ol className="mt-3 space-y-1.5 text-sm leading-relaxed list-decimal list-inside text-slate-200">
                {section.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
              {section.code && (
                <pre className="mt-3 text-xs text-slate-200 bg-black/50 rounded-lg p-3 overflow-auto whitespace-pre-wrap font-mono">{section.code}</pre>
              )}
              <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 mt-3">
                ✅ 过关自测：{section.checkpoint}
              </p>
            </div>
          </div>
        </section>
      ))}

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> 毕业项目（可选，但最能证明“会了”）</h3>
        <p className="text-sm text-slate-300 leading-relaxed mt-2">
          把三个项目串成一条线：爬虫爬数据存 CSV → pandas 清洗分析出结果 → FastAPI 把结果做成接口返回。
          能独立做完这个闭环，小白就不再是“学过 Python”，而是“能用 Python 干活”。
          这一步如果卡住，回到前面三个项目里对应的那一步补，别直接跳过去。
        </p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="font-bold">常见坑（提前说，比事后调要省时间）</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-300 leading-relaxed list-disc list-inside">
          {PITFALLS.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}
        </ul>
      </section>
    </div>
  );
}
