import { useState } from 'react';
import { CheckCircle2, Circle, Map, Lightbulb } from 'lucide-react';

/* 学习路线与方法页：只读指南 + 可勾选进度，不判题、不跑代码。
   路线对照的是主流教科书的共同章节结构，不是抄某一本书的例题：
   - 《Python 编程：从入门到实践》：变量、列表、字典、if、while、函数、类、文件异常、测试
   - 廖雪峰《Python 教程》：基础、高级特性、函数、高阶函数、面向对象、面向对象高级编程
   - 《Automate the Boring Stuff with Python》：基础、流程、函数、调试、列表、字典、字符串、正则、文件、CSV/JSON、爬虫
   闯关玩法是主线，保留；下面 8 种学习方法是在闯关之外加的，不是替代闯关。 */

interface Stage {
  id: string;
  title: string;
  level: string;
  books: string;
  lessons: string;
  checkpoint: string;
}

const STAGES: Stage[] = [
  {
    id: 's0',
    title: '第 0 阶段：准备与第一行代码',
    level: 'L1 · 概念',
    books: '《从入门到实践》第 1-2 章、廖雪峰基础篇',
    lessons: '新手村第 1 关（变量、print、f-string）+ 本地环境（第三阶段指南第 0 步）',
    checkpoint: '不查教程，能写出 print 和变量，并说出变量名是什么意思。',
  },
  {
    id: 's1',
    title: '第 1 阶段：基础语法',
    level: 'L1 · 概念',
    books: '《从入门到实践》第 2-6 章、廖雪峰基础篇、《Automate》第 1-3、6-8 章',
    lessons: '新手村全部、爬虫线、后端线、AI 线、教科书第 1-3 关（字符串方法、元组集合、切片）',
    checkpoint: '给一段没见过的数据，能自己选列表还是字典、for 还是 if，并写出来。',
  },
  {
    id: 's2',
    title: '第 2 阶段：函数与数据进阶',
    level: 'L2 · 逻辑',
    books: '《从入门到实践》第 7-8 章、廖雪峰函数与高级特性、《Automate》第 4 章',
    lessons: '进阶篇（异常、文件、字典计数、import、默认参数）+ 逻辑实战第 1-5 关 + 教科书第 4-7 关（while、函数进阶、递归、高阶函数）',
    checkpoint: '一个需求能拆成 2-3 个函数，每个函数只做一件事，组合起来跑通。',
  },
  {
    id: 's3',
    title: '第 3 阶段：面向对象',
    level: 'L2-L3 · 逻辑 + 项目',
    books: '《从入门到实践》第 9 章、廖雪峰面向对象与面向对象高级编程',
    lessons: '进阶篇类与对象 + 教科书第 9-10 关（继承多态、@property 与定制类）+ 逻辑实战第 5 关（图书馆借还，状态管理）',
    checkpoint: '能说出“类是模板、对象是实例、继承是复用、多态是同一方法不同表现”，并自己写一个子类。',
  },
  {
    id: 's4',
    title: '第 4 阶段：文件、异常、测试与调试',
    level: 'L3 · 调试 + 重构',
    books: '《从入门到实践》第 10-11 章、《Automate》第 5、10 章调试与文件',
    lessons: '进阶篇异常与文件 + 调试题 3 关 + 重构题 3 关 + 教科书第 11、13 关（JSON、异常进阶）',
    checkpoint: '程序报错时先读最后一行、再缩小范围定位；写完代码能自己写几个断言测边界。',
  },
  {
    id: 's5',
    title: '第 5 阶段：高阶特性与算法基础',
    level: 'L4 · 教科书进阶',
    books: '廖雪峰高级特性与高阶函数、《Automate》第 9、18 章正则与 CSV/JSON',
    lessons: '教科书第 8、12、14 关（生成器、正则进阶、排序搜索）+ 逻辑实战第 6-8 关（爬虫进阶、后端进阶、数据进阶）',
    checkpoint: '能讲出生成器和列表的区别、正则分组是什么意思、冒泡排序和二分查找各走了几步。',
  },
  {
    id: 's6',
    title: '第 6 阶段：实战方向与真实项目',
    level: 'L3-L4 · 项目',
    books: '《从入门到实践》第二部分、《Automate》第二部分、第三阶段指南',
    lessons: '实战项目 3 个（已升级为多步骤 + 边界版）+ 第三阶段指南（真实爬虫、真实后端、真实数据分析、毕业闭环项目）',
    checkpoint: '换一个没见过的小需求，能独立走完“拆需求 - 写代码 - 调报错 - 加功能”全流程。',
  },
];

const METHODS = [
  {
    title: '1. 游戏闯关（主线，保留）',
    use: '按路线一关一关做，先自己写，失败进错题本，通关自动打卡。不要跳关：后面每一关都默认前面关的概念已经会了。',
    rhythm: '每天 1-3 关，通关比赶进度重要。',
  },
  {
    title: '2. 主动回忆',
    use: '通关后不要只看答案：合上答案，关掉参考，凭记忆把这关重写一遍，写不出来再看答案，再重写。',
    rhythm: '每关通关后立刻做一次，5 分钟就够。',
  },
  {
    title: '3. 间隔重复',
    use: '错题本就是间隔重复的工具：今天错的题，明天重练一次，下周再重练一次。打卡统计里的连续打卡，是用来保住这个节奏的。',
    rhythm: '错题隔天必练，隔周抽查一次已攻克的题。',
  },
  {
    title: '4. 费曼讲解',
    use: '通关后试着用自己的话讲一遍这关的核心：比如“生成器是要一个算一个”、“继承是复用父类、多态是同一方法不同表现”。讲不出来，就回到题头再读一遍。可以在自由练习场里用注释把讲解写下来。',
    rhythm: '每个阶段结束时，讲一遍这个阶段最难的 3 个概念。',
  },
  {
    title: '5. 调试驱动',
    use: '报错先读最后一行，再往上找自己写的哪一行；先拿最短的数据试，再放回完整数据。调试题就是专门练这个的。',
    rhythm: '每次报错先自己定位 5 分钟，实在找不到再问 AI 助教，而且只问思路、不直接要完整代码。',
  },
  {
    title: '6. 重构阅读',
    use: '先读懂别人的乱代码，再动手拆：长函数拆成小函数、重复逻辑抽成一个函数、魔法数字换成有名字的常量。重构题就是专门练这个的。',
    rhythm: '每做完一个项目关，问自己一次：这段代码如果下个月再看，还能一眼看懂吗？',
  },
  {
    title: '7. 项目驱动',
    use: '每学完一个阶段，做一个小项目把这个阶段的东西串起来：基础阶段做成绩管理，函数阶段做购物车结算，面向对象阶段做图书馆借还，实战阶段做爬虫 + 后端 + 数据的闭环。',
    rhythm: '每个阶段末至少做 1 个项目，项目关和第三阶段指南里都有现成的。',
  },
  {
    title: '8. 默写与变式',
    use: '通关后换一组数据、换一个需求再做一遍：在自由练习场里把数字、名字、条件改掉，看代码还对不对。只会做原题，换数据就错，说明是背答案不是真会。',
    rhythm: '每周选 2 关做变式，数据一换还能过，才算过关。',
  },
];

const LADDER = [
  { level: 'L1 · 概念关', desc: '2-10 行，算一个答案：新手村、爬虫线、后端线、AI 线、教科书第 1-3 关。' },
  { level: 'L2 · 逻辑关', desc: '多个函数、多步骤、有边界：逻辑实战第 1-8 关、进阶篇、教科书第 4-7、9 关。' },
  { level: 'L3 · 调试 / 重构 / 项目关', desc: '读代码、改代码、做系统：调试题、重构题、实战项目 3 个（已升级）。' },
  { level: 'L4 · 教科书进阶关', desc: '需要组合前面所有知识：教科书第 8、10-14 关（生成器、类进阶、JSON、正则进阶、异常进阶、排序搜索）。' },
];

export default function Roadmap() {
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('pypocket-roadmap-done') || '{}');
    } catch {
      return {};
    }
  });

  function toggle(id: string) {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    localStorage.setItem('pypocket-roadmap-done', JSON.stringify(next));
  }

  const doneCount = STAGES.filter((s) => done[s.id]).length;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="font-bold text-lg flex items-center gap-2"><Map className="w-5 h-5 text-emerald-400" /> 学习路线：按教科书的共同章节，从 L1 到 L4</h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          这条路线对照的是三本主流入门书的共同章节结构，不是抄某一本书的例题：
          《Python 编程：从入门到实践》、廖雪峰《Python 教程》、《Automate the Boring Stuff with Python》。
          三本书都先讲变量、列表、字典、if、循环，再讲函数，再讲类，再讲文件异常测试，最后讲实战项目——
          本 App 的路线就是按这个顺序排的，之前缺的章节（切片、while、递归、生成器、继承、JSON、正则进阶等）已经补进了“教科书进阶”路线。
        </p>
        <p className="text-sm mt-2">
          阶段进度：<span className="font-bold text-emerald-400">{doneCount} / {STAGES.length}</span> 个阶段已勾选完成（只存在你的浏览器里，换设备不跟着走）
        </p>
        <div className="mt-3 space-y-1.5">
          {LADDER.map((row) => (
            <p key={row.level} className="text-sm text-slate-300"><span className="font-bold text-emerald-300">{row.level}</span>：{row.desc}</p>
          ))}
        </div>
        <p className="text-sm text-slate-400 mt-3">
          难度不是堆行数：L1 到 L4 升的是组合复杂度——从“算一个答案”到“多个函数 + 多步骤 + 边界”，再到“读别人的代码、改别人的代码、做一个系统”。
        </p>
      </section>

      {STAGES.map((stage) => (
        <section key={stage.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-start gap-3">
            <button onClick={() => toggle(stage.id)} className="shrink-0 mt-0.5" title={done[stage.id] ? '标记为未完成' : '标记为已完成'}>
              {done[stage.id] ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Circle className="w-6 h-6 text-slate-500" />}
            </button>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold">{stage.title}</h3>
              <p className="text-xs text-emerald-300 mt-1">{stage.level} · 教科书对应：{stage.books}</p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">本阶段关卡：{stage.lessons}</p>
              <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 mt-3">
                ✅ 过关自测：{stage.checkpoint}
              </p>
            </div>
          </div>
        </section>
      ))}

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="font-bold flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-400" /> 学习方法：闯关是主线，下面 7 种是加在闯关之外的，不要移出闯关</h3>
        <div className="mt-3 space-y-3">
          {METHODS.map((method) => (
            <div key={method.title}>
              <p className="font-bold text-sm">{method.title}</p>
              <p className="text-sm text-slate-300 leading-relaxed mt-1">{method.use}</p>
              <p className="text-xs text-slate-400 mt-1">节奏：{method.rhythm}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-400 mt-4 leading-relaxed">
          一句话总结教科书级别的学习方法：先闯关学会一个概念（输入），立刻合上答案重写一遍（主动回忆），
          错了进错题本隔天重练（间隔重复），能用自己的话讲出来（费曼讲解），每个阶段末做一个项目把概念串起来（项目驱动）。
          只看书、只看答案、只刷原题，这三种都不算学过。
        </p>
      </section>
    </div>
  );
}
