// Editable question bank. Add new questions by copying one object in SBIT_QUESTION_BANK.
// Each question needs exactly 4 choices; score keys: M/L/Z/S/D/J/F/R.
window.SBIT_QUESTION_BANK = [
      {
        text: "早上打开电脑，你觉得自己更像什么？",
        choices: [
          { title: "一台欠费开机的肉体云服务器", note: "风扇响了，人没醒。", score: { M: 2, R: 1 } },
          { title: "自动执行昨日痛苦的脚本", note: "不用思考，工单会替我思考。", score: { L: 2, R: 1 } },
          { title: "在线状态模拟器", note: "头像亮着就是劳动关系。", score: { Z: 2, M: 1 } },
          { title: "准备逃往厕所的可疑进程", note: "启动项：肠胃、手机、自由。", score: { D: 2, F: 1 } }
        ]
      },
      {
        text: "需求文档写着“简单做一下”，你闻到了什么？",
        choices: [
          { title: "三周排期的尸臭", note: "简单两个字通常不简单。", score: { S: 2, R: 1 } },
          { title: "PPT 里冒出来的香精味", note: "先包装成价值，再塞给研发。", score: { Z: 2, J: 1 } },
          { title: "我将成为背锅容器", note: "边界不清，锅很清。", score: { F: 2, S: 1 } },
          { title: "先拖两天看它会不会死", note: "很多需求活不过周三。", score: { M: 2, D: 1 } }
        ]
      },
      {
        text: "领导问“有风险吗”，你的真实翻译是？",
        choices: [
          { title: "有，但你不想听", note: "我说完你会让我克服。", score: { S: 2, F: 1 } },
          { title: "没有，直到上线那天有", note: "薛定谔的事故。", score: { R: 2, Z: 1 } },
          { title: "风险就是我本人还没辞职", note: "人的稳定性是最大单点。", score: { F: 2, M: 1 } },
          { title: "我会写进周报假装管理过", note: "风险闭环：写了等于没有。", score: { Z: 2, J: 1 } }
        ]
      },
      {
        text: "下午三点灵魂掉线，你会把自己移交给？",
        choices: [
          { title: "厕所隔间", note: "公司最后一块未被排期污染的圣地。", score: { D: 3 } },
          { title: "技术文章收藏夹", note: "看标题就算学习，收藏就算精通。", score: { M: 2, Z: 1 } },
          { title: "咖啡因和肌肉记忆", note: "人不在，手还会敲。", score: { L: 2, J: 1 } },
          { title: "一个用来偷懒的自动化脚本", note: "懒不是缺陷，是架构思想。", score: { S: 2, F: 1 } }
        ]
      },
      {
        text: "祖传屎山突然报错，你的第一反应是？",
        choices: [
          { title: "先骂作者，再发现是我写的", note: "考古挖到自己的尸体。", score: { F: 1, L: 2 } },
          { title: "绕开它，别惊醒古神", note: "屎山有生态，重构会塌方。", score: { M: 2, R: 1 } },
          { title: "补日志，让它自己招供", note: "玄学问题先刑讯逼供。", score: { S: 2, L: 1 } },
          { title: "截图发群求围观", note: "痛苦不分享就白痛了。", score: { D: 1, F: 2 } }
        ]
      },
      {
        text: "你最擅长的恶臭职场拟态是？",
        choices: [
          { title: "忙到冒烟但产物不可见", note: "高频动作，低维产出。", score: { Z: 3 } },
          { title: "低调摸鱼但关键时刻救火", note: "摸鱼的劳模，薛定谔主力。", score: { M: 2, L: 1 } },
          { title: "每句话都像离职倒计时", note: "但五险一金把我按住了。", score: { F: 2, R: 1 } },
          { title: "看起来摆烂，其实全知道", note: "沉默不是无知，是懒得参战。", score: { S: 2, M: 1 } }
        ]
      },
      {
        text: "产品说“这个交互很小”，你脑内弹窗是？",
        choices: [
          { title: "小？那你自己写？", note: "反骨从括号里长出来。", score: { F: 2, S: 1 } },
          { title: "又要改数据结构了", note: "小改动，大地震。", score: { S: 2, L: 1 } },
          { title: "先答应，回去评估怎么拖", note: "缓冲区是成年人的尊严。", score: { M: 2, R: 1 } },
          { title: "做一版能演示的幻觉", note: "Demo 不是产品，是魔术。", score: { Z: 2, J: 1 } }
        ]
      },
      {
        text: "下班前 10 分钟有人 @ 你，你的身体协议是？",
        choices: [
          { title: "进入已读不回保护模式", note: "通知也要遵守劳动法。", score: { M: 2, R: 1 } },
          { title: "回一个表情包封印责任", note: "收到，但没完全收到。", score: { Z: 2, D: 1 } },
          { title: "当场解决，防止梦里返场", note: "焦虑驱动开发。", score: { L: 2, J: 1 } },
          { title: "问：为什么现在才说？", note: "一句话点燃流程废墟。", score: { F: 2, S: 1 } }
        ]
      },
      {
        text: "你对加班截图的态度是？",
        choices: [
          { title: "不截，痛苦不是朋友圈素材", note: "我只想消失。", score: { M: 2, R: 1 } },
          { title: "截，苦劳需要证据链", note: "灯光、时钟、终端，缺一不可。", score: { J: 2, Z: 1 } },
          { title: "先干完再骂", note: "专业素养和精神崩溃并存。", score: { L: 2, F: 1 } },
          { title: "人在公司，脑子下线", note: "一种物理加班，精神旷工。", score: { D: 2, Z: 1 } }
        ]
      },
      {
        text: "你写 CRUD 后台时最大的感受是？",
        choices: [
          { title: "我是一台表单复读机", note: "增删改查，查改删增。", score: { L: 2, R: 2 } },
          { title: "能不能自动生成后我去死一下", note: "重复劳动会污染人格。", score: { M: 2, F: 1 } },
          { title: "字段名像产品随手撒的米", note: "命名不是沟通，是占卜。", score: { S: 2, F: 1 } },
          { title: "截图进日报：完成核心能力建设", note: "把表格包装成平台化。", score: { Z: 2, J: 1 } }
        ]
      },
      {
        text: "周报里你最想使用的文学体裁是？",
        choices: [
          { title: "持续推进体", note: "什么都没说，但像干了很多。", score: { Z: 2, M: 1 } },
          { title: "历史遗留受难体", note: "修 bug 像替前人还债。", score: { L: 2, R: 1 } },
          { title: "效率优化自嗨体", note: "其实是为了更高级地偷懒。", score: { M: 2, S: 1 } },
          { title: "流程风险阴阳体", note: "翻译：你们这样迟早出事。", score: { F: 2, S: 1 } }
        ]
      },
      {
        text: "视频会议开到第 47 分钟，你在干嘛？",
        choices: [
          { title: "点头，但脑内在卸载公司", note: "摄像头里的我只是皮肤。", score: { M: 2, Z: 1 } },
          { title: "记录一句没人会看的结论", note: "会议纪要是电子骨灰。", score: { L: 1, R: 2 } },
          { title: "准备一句安全废话", note: "‘我补充一点’但不真的补充。", score: { Z: 2, J: 1 } },
          { title: "想把日历全部炸掉", note: "反会议恐怖分子。", score: { F: 2, S: 1 } }
        ]
      },
      {
        text: "线上报警响起，你更像哪种生物？",
        choices: [
          { title: "被电击复活的尸体", note: "平时死，报警活。", score: { L: 2, R: 2 } },
          { title: "日志巷里的流浪侦探", note: "堆栈会说话，只是很脏。", score: { S: 2, L: 1 } },
          { title: "先问是不是我的服务", note: "甩锅是人类本能。", score: { F: 1, Z: 2 } },
          { title: "祈祷它自己恢复", note: "自愈系统，拜托你自愈。", score: { M: 2, D: 1 } }
        ]
      },
      {
        text: "面对 Code Review 的评论，你最想回复？",
        choices: [
          { title: "你说得对，但我不想改", note: "理性认可，身体拒绝。", score: { M: 2, F: 1 } },
          { title: "这个历史原因比较复杂", note: "复杂=没人敢动。", score: { R: 2, Z: 1 } },
          { title: "已修，顺手补了测试", note: "过度靠谱也是一种病。", score: { L: 2, S: 1 } },
          { title: "我们要不要先统一规范？", note: "把战场扩大到制度层。", score: { S: 2, F: 1 } }
        ]
      },
      {
        text: "如果公司文化是一门编程语言，你觉得它是？",
        choices: [
          { title: "弱类型废话脚本", note: "什么都能解释，什么都不负责。", score: { Z: 2, F: 1 } },
          { title: "没有文档的祖传框架", note: "靠口口相传和老人脸色运行。", score: { R: 2, S: 1 } },
          { title: "只能追加不能删除的日志", note: "会议越来越多，人越来越空。", score: { D: 2, M: 1 } },
          { title: "一个我想 fork 的烂项目", note: "不想维护，只想重开。", score: { F: 2, S: 1 } }
        ]
      },
      {
        text: "你理想中的工位结局是？",
        choices: [
          { title: "没人找我，我偷偷变强", note: "安静、低社交、高缓存命中。", score: { S: 2, M: 1 } },
          { title: "任务清楚，到点消失", note: "不是梦想，是基本人权。", score: { L: 2, R: 1 } },
          { title: "看起来很忙，实际很空", note: "人生已经够具体了，工作可以抽象。", score: { Z: 2, D: 1 } },
          { title: "工资到账，灵魂下班", note: "一切文化最终都该体现在银行卡。", score: { F: 2, M: 1 } }
        ]
      },
      {
        text: "线上报警在群里响了三次，你第一反应是？",
        choices: [
          { title: "先看是不是我写的", note: "责任边界是成年人最后的护城河。", score: { S: 2, R: 1 } },
          { title: "假装刚去倒水", note: "物理离席，精神避险。", score: { M: 2, D: 1 } },
          { title: "马上开日志定位", note: "守夜人的眼睛里没有睡眠。", score: { L: 2, S: 1 } },
          { title: "问一句谁发版了", note: "空气突然开始审判。", score: { F: 2, J: 1 } }
        ]
      },
      {
        text: "产品说『这个需求很简单』，你脑内弹出的提示是？",
        choices: [
          { title: "简单的是嘴，不是系统", note: "复杂度不会因为语气温柔就消失。", score: { F: 2, S: 1 } },
          { title: "好的呢，我看下", note: "先把人格切到兼容模式。", score: { R: 2, Z: 1 } },
          { title: "先排期，下个迭代见", note: "用流程把火慢慢盖住。", score: { J: 2, S: 1 } },
          { title: "能不能先出个原型", note: "把锅递回需求出生地。", score: { S: 2, F: 1 } }
        ]
      },
      {
        text: "周五下午有人说『顺手发一下版』，你会？",
        choices: [
          { title: "强推，命运自会合并", note: "勇敢的人先被生产教育。", score: { F: 2, L: 1 } },
          { title: "建议下周一发", note: "理性不是胆小，是想活。", score: { S: 2, R: 1 } },
          { title: "已读但不回", note: "沉默是最轻量的拒绝。", score: { M: 2, F: 1 } },
          { title: "开始写回滚预案", note: "悲观主义者负责让世界别炸。", score: { L: 2, J: 1 } }
        ]
      },
      {
        text: "需求评审开到一半，你发现没人知道自己在说什么，你会？",
        choices: [
          { title: "认真记下所有废话", note: "会议纪要也是一种考古。", score: { L: 1, R: 2 } },
          { title: "开小窗刷文档", note: "在无意义里偷一点有意义。", score: { M: 2, S: 1 } },
          { title: "提出关键问题让全场沉默", note: "反骨但有效。", score: { F: 2, S: 1 } },
          { title: "点头并说我没问题", note: "装作系统兼容所有输入。", score: { Z: 2, R: 1 } }
        ]
      },
      {
        text: "你看到祖传代码里有一段没人敢删的 if，你觉得它像？",
        choices: [
          { title: "公司祠堂里的牌位", note: "不理解，但必须尊重。", score: { R: 2, S: 1 } },
          { title: "暗门，删了会召唤事故", note: "经验告诉我别乱动。", score: { S: 2, J: 1 } },
          { title: "前任留下的诅咒", note: "每个变量名都像遗言。", score: { F: 1, D: 2 } },
          { title: "先截图发群里哈哈哈", note: "痛苦需要围观才完整。", score: { Z: 1, M: 2 } }
        ]
      },
      {
        text: "日报要求写『今日价值产出』，你最可能写？",
        choices: [
          { title: "推进若干事项闭环", note: "若干=我也不知道几个。", score: { Z: 2, R: 1 } },
          { title: "定位并修复历史问题", note: "历史问题是万能遮羞布。", score: { L: 2, J: 1 } },
          { title: "持续跟进中", note: "进度没有动，但句子动了。", score: { M: 1, Z: 2 } },
          { title: "无，今天活着", note: "极简主义日报。", score: { F: 2, D: 1 } }
        ]
      },
      {
        text: "当你连续第三次被拉进无关会议，你决定？",
        choices: [
          { title: "摄像头关掉，灵魂下线", note: "只保留最低限度的人类接口。", score: { M: 2, D: 1 } },
          { title: "主动同步风险", note: "让会议知道自己不是免费的。", score: { F: 1, S: 2 } },
          { title: "做一页会后总结", note: "把痛苦产品化。", score: { Z: 2, J: 1 } },
          { title: "接受命运，继续点头", note: "头会动，人不会。", score: { R: 2, Z: 1 } }
        ]
      },
      {
        text: "你最怕哪种消息在晚上 11 点出现？",
        choices: [
          { title: "在吗", note: "两个字，万钧重。", score: { D: 2, R: 1 } },
          { title: "线上有点问题", note: "有点=可能整个世界在漏水。", score: { L: 2, S: 1 } },
          { title: "明早要个方案", note: "时间管理大师已上线。", score: { J: 2, R: 1 } },
          { title: "这个能不能顺便", note: "顺便是现代职场的暗器。", score: { F: 2, Z: 1 } }
        ]
      },
      {
        text: "你打开 IDE 的第一分钟，最像哪种状态？",
        choices: [
          { title: "插件更新，人生暂停", note: "先等工具替我拖延。", score: { M: 2, Z: 1 } },
          { title: "直接跑测试", note: "用失败唤醒今天。", score: { L: 2, S: 1 } },
          { title: "看昨天留下的 TODO", note: "像看前世欠条。", score: { R: 2, D: 1 } },
          { title: "先换主题和字体", note: "代码没变，但心情重构了。", score: { Z: 2, M: 1 } }
        ]
      },
      {
        text: "老板说『大家都是创业心态』，你的翻译器输出？",
        choices: [
          { title: "工资员工，风险合伙", note: "听起来就很节约预算。", score: { F: 2, R: 1 } },
          { title: "又要免费燃烧了", note: "激情是最便宜的云资源。", score: { D: 2, M: 1 } },
          { title: "我先对齐目标", note: "礼貌地把话术接住。", score: { Z: 2, R: 1 } },
          { title: "那能不能创业分红", note: "用天真反杀画饼。", score: { F: 2, S: 1 } }
        ]
      },
      {
        text: "你调 bug 调到怀疑人生时，最信任谁？",
        choices: [
          { title: "日志", note: "它冷漠，但一般不撒谎。", score: { S: 2, L: 1 } },
          { title: "橡皮鸭", note: "至少它不会插需求。", score: { D: 1, S: 2 } },
          { title: "Stack Overflow 旧回答", note: "考古也是研发的一部分。", score: { J: 1, L: 2 } },
          { title: "玄学重启", note: "科学尽头是重开。", score: { M: 2, R: 1 } }
        ]
      },
      {
        text: "你发现同事把临时方案写成了永久架构，你会？",
        choices: [
          { title: "补一层抽象继续活", note: "用新的债盖住旧的债。", score: { L: 1, R: 2 } },
          { title: "写 RFC 宣布开战", note: "文明人的约架方式。", score: { F: 2, S: 1 } },
          { title: "备注 TODO 永不处理", note: "立碑，但不扫墓。", score: { M: 2, D: 1 } },
          { title: "做成 PPT 争取重构预算", note: "技术债需要金融化。", score: { Z: 2, J: 1 } }
        ]
      },
      {
        text: "当有人问『这个接口为什么这么慢』，你会先怀疑？",
        choices: [
          { title: "数据库没索引", note: "经典嫌疑人永不缺席。", score: { S: 2, L: 1 } },
          { title: "需求本身就很慢", note: "业务复杂度伪装成性能问题。", score: { F: 1, R: 2 } },
          { title: "是不是网络抽风", note: "把锅交给看不见的地方。", score: { Z: 1, M: 2 } },
          { title: "先加 loading", note: "用户体验式拖延。", score: { Z: 2, J: 1 } }
        ]
      },
      {
        text: "如果你的上班状态是一条 HTTP 状态码，它更像？",
        choices: [
          { title: "200 OK，但内容为空", note: "看起来成功，其实没东西。", score: { Z: 2, R: 1 } },
          { title: "202 Accepted", note: "接受了，不代表会做。", score: { M: 2, J: 1 } },
          { title: "418 I'm a teapot", note: "荒谬但诚实。", score: { F: 2, D: 1 } },
          { title: "503 Service Unavailable", note: "人还在，服务没了。", score: { D: 2, R: 1 } }
        ]
      }
];
