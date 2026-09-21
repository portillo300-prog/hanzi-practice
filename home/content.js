/*
  CONTENT — the ONLY file you edit to change what she practices.

  Each item:  s = simplified,  t = traditional (same length as s),
              py = pinyin with tone NUMBERS (1-4, 5 = neutral), one syllable per space
                   (e.g. "xi3 huan5" shows as "xǐ huan"; v = ü),
              alt = optional second pinyin spelling shown after a slash,
              en = English meaning.
  Each lesson also has a `sticker` emoji and an `accent` color for each style (used on the home screen and celebrations).

  After editing, run:  node scripts/build.mjs   (fetches stroke data + refreshes the offline cache)
*/
window.CONTENT = {
  appTitle: { s: '写汉字', t: '寫漢字' },
  lessons: [
    {
      id: 'l1',
      number: 1,
      sticker: '🐼',          // sticker she earns for this lesson
      accent: '#4fd1c5',      // the lesson's color (Normal style)
      accentElena: '#e85a94', // ... and in Elena style
      title: { s: '在中文学校', t: '在中文學校' },
      py: 'zai4 zhong1 wen2 xue2 xiao4',
      en: 'At a Chinese School',
      characters: [
        { s: '在', t: '在', py: 'zai4', en: 'at, in' },
        { s: '教', t: '教', py: 'jiao1', en: 'to teach' },
        { s: '汉', t: '漢', py: 'han4', en: 'Chinese (Han)' },
        { s: '语', t: '語', py: 'yu3', en: 'language' },
        { s: '写', t: '寫', py: 'xie3', en: 'to write' },
        { s: '字', t: '字', py: 'zi4', en: 'character' },
        { s: '读', t: '讀', py: 'du2', en: 'to read' },
        { s: '歌', t: '歌', py: 'ge1', en: 'song' },
        { s: '画', t: '畫', py: 'hua4', en: 'to draw' },
        { s: '喜', t: '喜', py: 'xi3', en: 'to like' },
        { s: '欢', t: '歡', py: 'huan1', en: 'joyful (喜欢 = to like)' }
      ],
      words: [
        { s: '在家', t: '在家', py: 'zai4 jia1', en: 'at home' },
        { s: '在学校', t: '在學校', py: 'zai4 xue2 xiao4', en: 'at school' },
        { s: '中文', t: '中文', py: 'zhong1 wen2', en: 'Chinese (language)' },
        { s: '汉语', t: '漢語', py: 'han4 yu3', en: 'Chinese language' },
        { s: '汉字', t: '漢字', py: 'han4 zi4', en: 'Chinese characters' },
        { s: '写字', t: '寫字', py: 'xie3 zi4', en: 'to write characters' },
        { s: '画画儿', t: '畫畫兒', py: 'hua4 huar4', en: 'to draw pictures' },
        { s: '儿歌', t: '兒歌', py: 'er2 ge1', en: 'nursery rhyme' },
        { s: '喜欢', t: '喜歡', py: 'xi3 huan5', en: 'to like' }
      ]
    },
    {
      id: 'l3',
      number: 3,
      sticker: '🎒',
      accent: '#ff8a5b',
      accentElena: '#f08a4b',
      title: { s: '放学了', t: '放學了' },
      py: 'fang4 xue2 le5',
      en: 'Class Is Over',
      characters: [
        { s: '放', t: '放', py: 'fang4', en: 'to let go (放学 = class is over)' },
        { s: '今', t: '今', py: 'jin1', en: 'today' },
        { s: '星', t: '星', py: 'xing1', en: 'star' },
        { s: '期', t: '期', py: 'qi1', en: 'period (星期 = week)' },
        { s: '告', t: '告', py: 'gao4', en: 'to tell' },
        { s: '诉', t: '訴', py: 'su4', en: 'to tell (告诉 = to tell someone)' },
        { s: '午', t: '午', py: 'wu3', en: 'noon' },
        { s: '朋', t: '朋', py: 'peng2', en: 'friend' },
        { s: '友', t: '友', py: 'you3', en: 'friend' },
        { s: '问', t: '問', py: 'wen4', en: 'to ask' },
        { s: '谁', t: '誰', py: 'shei2', alt: 'shui2', en: 'who' },
        { s: '听', t: '聽', py: 'ting1', en: 'to listen' },
        { s: '心', t: '心', py: 'xin1', en: 'heart (放心 = don\'t worry)' }
      ],
      words: [
        { s: '放学', t: '放學', py: 'fang4 xue2', en: 'class is over' },
        { s: '放心', t: '放心', py: 'fang4 xin1', en: 'don\'t worry' },
        { s: '告诉', t: '告訴', py: 'gao4 su5', en: 'to tell' },
        { s: '今天', t: '今天', py: 'jin1 tian1', en: 'today' },
        { s: '星期一', t: '星期一', py: 'xing1 qi1 yi1', en: 'Monday' },
        { s: '上午', t: '上午', py: 'shang4 wu3', en: 'morning' },
        { s: '中午', t: '中午', py: 'zhong1 wu3', en: 'noon' },
        { s: '下午', t: '下午', py: 'xia4 wu3', en: 'afternoon' },
        { s: '朋友', t: '朋友', py: 'peng2 you5', en: 'friend' }
      ]
    }
  ],

  /* WORD LAB: extra words she can discover by combining characters from her book.
     group 'starter' = built only from her book's characters; 'stretch' = adds one or two NEW characters.
     `how` is the little "why it means that" story shown on the word card. */
  lab: {
    title: { s: '词语', t: '詞語' },
    words: [
      { group: 'starter', s: '学生', t: '學生', py: 'xue2 sheng5', en: 'student', how: '学 (study) + 生 (a person growing up) = student!' },
      { group: 'starter', s: '同学', t: '同學', py: 'tong2 xue2', en: 'classmate', how: '同 (same) + 学 (study) = people who study together: classmates!' },
      { group: 'starter', s: '上学', t: '上學', py: 'shang4 xue2', en: 'go to school', how: '上 (go to) + 学 (study) = go to school!' },
      { group: 'starter', s: '小学', t: '小學', py: 'xiao3 xue2', en: 'elementary school', how: '小 (small) + 学 (school) = elementary school.' },
      { group: 'starter', s: '大学', t: '大學', py: 'da4 xue2', en: 'university, college', how: '大 (big) + 学 (school) = university!' },
      { group: 'starter', s: '生日', t: '生日', py: 'sheng1 ri4', en: 'birthday', how: '生 (born) + 日 (day) = birthday!' },
      { group: 'starter', s: '老师', t: '老師', py: 'lao3 shi1', en: 'teacher', how: '老 (wise, experienced) + 师 (master) = teacher.' },
      { group: 'starter', s: '开心', t: '開心', py: 'kai1 xin1', en: 'happy', how: '开 (open) + 心 (heart) = an open heart: happy!' },
      { group: 'starter', s: '小心', t: '小心', py: 'xiao3 xin1', en: 'be careful', how: '小 (small) + 心 (heart) = be careful, take care.' },
      { group: 'starter', s: '听写', t: '聽寫', py: 'ting1 xie3', en: 'dictation', how: '听 (listen) + 写 (write) = dictation: listen, then write!' },
      { group: 'starter', s: '星星', t: '星星', py: 'xing1 xing5', en: 'star', how: '星 (star) twice = twinkling stars!' },
      { group: 'starter', s: '好朋友', t: '好朋友', py: 'hao3 peng2 you5', en: 'good friend', how: '好 (good) + 朋友 (friend) = good friend.' },
      { group: 'starter', s: '星期', t: '星期', py: 'xing1 qi1', en: 'week', how: '星 (star) + 期 (period of time) = week. Add 一 to make Monday!' },
      { group: 'stretch', s: '学习', t: '學習', py: 'xue2 xi2', en: 'to study, to learn', how: '学 (study) + 习 (practice) = to study and practice!' },
      { group: 'stretch', s: '先生', t: '先生', py: 'xian1 sheng5', en: 'Mr., sir', how: '先 (first) + 生 (born) = "born first": Mr., sir.' },
      { group: 'stretch', s: '生活', t: '生活', py: 'sheng1 huo2', en: 'life, daily life', how: '生 (life) + 活 (alive) = life, daily life.' },
      { group: 'stretch', s: '医生', t: '醫生', py: 'yi1 sheng1', en: 'doctor', how: '医 (medicine) + 生 (person) = doctor.' },
      { group: 'stretch', s: '教室', t: '教室', py: 'jiao4 shi4', en: 'classroom', how: '教 (teach) + 室 (room) = classroom.' },
      { group: 'stretch', s: '唱歌', t: '唱歌', py: 'chang4 ge1', en: 'to sing', how: '唱 (sing) + 歌 (song) = to sing a song!' },
      { group: 'stretch', s: '欢迎', t: '歡迎', py: 'huan1 ying2', en: 'welcome', how: '欢 (joyful) + 迎 (greet) = welcome!' },
      { group: 'stretch', s: '名字', t: '名字', py: 'ming2 zi5', en: 'name', how: '名 (name) + 字 (character) = a name!' },
      { group: 'stretch', s: '问题', t: '問題', py: 'wen4 ti2', en: 'question', how: '问 (ask) + 题 (topic) = a question.' },
      { group: 'stretch', s: '现在', t: '現在', py: 'xian4 zai4', en: 'now', how: '现 (appear, now) + 在 (at) = right now.' },
      { group: 'stretch', s: '东西', t: '東西', py: 'dong1 xi5', en: 'thing, stuff', how: '东 (east) + 西 (west) = things! Everything from east to west.' }
    ]
  }
};
