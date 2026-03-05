/* ═══════════════════════════════════════════════
   ADIBA'S IELTS — script.js
   ═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   PAGE NAVIGATION
───────────────────────────────────────────── */
function go(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('pg-' + id);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
  }
  if (id === 'vocabulary') renderVocab();
}

/* ─────────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────────── */
function toast(msg) {
  const el = document.getElementById('toast-el');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3200);
}

/* ─────────────────────────────────────────────
   VOCABULARY FLASHCARDS
───────────────────────────────────────────── */
const vocabData = [
  {
    word: 'Abundant',
    pos: 'Adjective',
    level: 'Intermediate',
    def: 'Existing or available in large quantities; plentiful',
    ex: 'The region has abundant natural resources.'
  },
  {
    word: 'Mitigate',
    pos: 'Verb',
    level: 'Advanced',
    def: 'Make less severe, serious, or painful',
    ex: 'Measures to mitigate the effects of climate change are essential.'
  },
  {
    word: 'Persevere',
    pos: 'Verb',
    level: 'Intermediate',
    def: 'Continue in a course of action despite difficulty',
    ex: 'Students must persevere through challenging topics.'
  },
  {
    word: 'Ubiquitous',
    pos: 'Adjective',
    level: 'Advanced',
    def: 'Present, appearing, or found everywhere',
    ex: 'Smartphones have become ubiquitous in modern society.'
  },
  {
    word: 'Advocate',
    pos: 'Verb',
    level: 'Intermediate',
    def: 'Publicly recommend or support',
    ex: 'Environmental groups advocate for stricter pollution controls.'
  },
  {
    word: 'Coherent',
    pos: 'Adjective',
    level: 'Advanced',
    def: 'Logical and consistent; easy to understand',
    ex: 'She presented a coherent argument for the proposal.'
  }
];

let vcIdx = 0;
let vcLearned = new Set();

function renderVocab() {
  const card = vocabData[vcIdx];
  document.getElementById('vc-word').textContent  = card.word;
  document.getElementById('vc-pos').textContent   = card.pos;
  document.getElementById('vc-level').textContent = card.level;
  document.getElementById('vc-def').textContent   = card.def;
  document.getElementById('vc-ex').textContent    = `"${card.ex}"`;
  document.getElementById('vc-lbl').textContent   = `Card ${vcIdx + 1} of ${vocabData.length}`;
  document.getElementById('vc-learned').textContent = `${vcLearned.size} learned`;
  document.getElementById('vc-fill').style.width  = `${((vcIdx + 1) / vocabData.length) * 100}%`;
  document.getElementById('flashcard').classList.remove('flipped');
}

function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
}

function nextCard() {
  vcIdx = (vcIdx + 1) % vocabData.length;
  renderVocab();
}

function prevCard() {
  vcIdx = (vcIdx - 1 + vocabData.length) % vocabData.length;
  renderVocab();
}

function markLearned() {
  if (vcLearned.has(vcIdx)) {
    vcLearned.delete(vcIdx);
    toast('Removed from learned');
  } else {
    vcLearned.add(vcIdx);
    toast('✓ Marked as learned!');
  }
  renderVocab();
}

/* ─────────────────────────────────────────────
   WRITING PRACTICE
───────────────────────────────────────────── */
const writingPrompts = [
  {
    type: 'Task 2 – Opinion Essay',
    prompt: 'Some people believe that universities should focus on providing academic skills, while others think that universities should prepare students for their future careers. Discuss both views and give your own opinion.',
    tips: [
      'Write at least 250 words',
      'Include an introduction, body paragraphs, and conclusion',
      'Present both viewpoints before giving your opinion',
      'Use formal academic language'
    ],
    limit: 250
  },
  {
    type: 'Task 2 – Problem/Solution',
    prompt: 'In many countries, the amount of waste produced by households and industries is increasing. What are the causes of this problem? What measures could be taken to reduce it?',
    tips: [
      'Write at least 250 words',
      'Clearly identify causes in one section',
      'Propose practical solutions in another section',
      'Support your points with examples'
    ],
    limit: 250
  },
  {
    type: 'Task 1 – Letter Writing',
    prompt: 'You recently attended a conference and would like to give a presentation about the information you gained. Write a letter to your manager. Describe the conference, explain what you learned, and suggest how this information could benefit your company.',
    tips: [
      'Write at least 150 words',
      'Use appropriate letter format',
      'Address all three bullet points',
      'Maintain a professional tone'
    ],
    limit: 150
  }
];

let currentPromptIdx = 0;

function selPrompt(idx, btn) {
  currentPromptIdx = idx;
  document.querySelectorAll('.prompt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const p = writingPrompts[idx];
  document.getElementById('wp-type').textContent   = p.type;
  document.getElementById('wp-prompt').textContent = p.prompt;
  document.getElementById('wp-tips').innerHTML = p.tips.map(t => `<li>${t}</li>`).join('');
  resetEssay();
}

function updateWC() {
  const text  = document.getElementById('essay-ta').value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const limit = writingPrompts[currentPromptIdx].limit;
  const el    = document.getElementById('wc-disp');
  el.textContent = `${words} / ${limit} words`;
  el.className   = 'wc' + (words >= limit ? ' met' : '');
}

function submitEssay() {
  const text  = document.getElementById('essay-ta').value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const limit = writingPrompts[currentPromptIdx].limit;

  if (words < limit) {
    toast(`Please write at least ${limit} words (you have ${words})`);
    return;
  }

  document.getElementById('essay-ok').style.display   = 'block';
  document.getElementById('final-wc').textContent     = words;
  document.getElementById('essay-ta').disabled        = true;
  document.getElementById('sub-btn').style.opacity    = '0.5';
  document.getElementById('sub-btn').style.pointerEvents = 'none';
  toast('Essay submitted! 🎉');
}

function resetEssay() {
  const ta  = document.getElementById('essay-ta');
  const btn = document.getElementById('sub-btn');
  ta.value         = '';
  ta.disabled      = false;
  btn.style.opacity       = '1';
  btn.style.pointerEvents = 'auto';
  document.getElementById('essay-ok').style.display = 'none';
  updateWC();
}

/* ─────────────────────────────────────────────
   SPEAKING PRACTICE
───────────────────────────────────────────── */
let speakTimer    = null;
let speakSecs     = 120;
let isRecording   = false;

function selQ(idx, card) {
  document.querySelectorAll('.q-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  stopRecording();
  speakSecs = 120;
  document.getElementById('spk-timer').textContent = '2:00';
  document.getElementById('spk-lbl').textContent   = 'Press the mic to start recording';
}

function toggleRec(btn) {
  if (!isRecording) {
    isRecording = true;
    btn.classList.add('recording');
    document.getElementById('spk-lbl').textContent = '🔴 Recording…';

    speakTimer = setInterval(() => {
      speakSecs--;
      const m = Math.floor(speakSecs / 60);
      const s = speakSecs % 60;
      document.getElementById('spk-timer').textContent = `${m}:${s.toString().padStart(2, '0')}`;

      if (speakSecs <= 0) {
        stopRecording();
        toast('Time is up! Great effort! 🎤');
      }
    }, 1000);
  } else {
    stopRecording();
    toast('Recording stopped. Well done!');
  }
}

function stopRecording() {
  isRecording = false;
  clearInterval(speakTimer);
  const btn = document.getElementById('rec-btn');
  if (btn) btn.classList.remove('recording');
  const lbl = document.getElementById('spk-lbl');
  if (lbl) lbl.textContent = 'Press the mic to start recording';
}

/* ─────────────────────────────────────────────
   LISTENING AUDIO PLAYER (simulated)
───────────────────────────────────────────── */
let isPlaying   = false;
let audioTimer  = null;
let audioSecs   = 0;
const totalSecs = 165; // 2:45

function togglePlay(btn) {
  if (!isPlaying) {
    isPlaying = true;
    btn.textContent = '⏸';

    audioTimer = setInterval(() => {
      audioSecs = Math.min(audioSecs + 1, totalSecs);
      const pct = (audioSecs / totalSecs) * 100;
      document.getElementById('audio-prog').style.width = pct + '%';

      const m1 = Math.floor(audioSecs / 60);
      const s1 = audioSecs % 60;
      const m2 = Math.floor(totalSecs / 60);
      const s2 = totalSecs % 60;
      document.getElementById('audio-time').textContent =
        `${m1}:${s1.toString().padStart(2, '0')} / ${m2}:${s2.toString().padStart(2, '0')}`;

      if (audioSecs >= totalSecs) {
        isPlaying = false;
        btn.textContent = '▶';
        clearInterval(audioTimer);
      }
    }, 1000);

  } else {
    isPlaying = false;
    btn.textContent = '▶';
    clearInterval(audioTimer);
  }
}

/* ─────────────────────────────────────────────
   READING — CHECK ANSWERS
───────────────────────────────────────────── */
const readingAnswers = {
  rq1: 'Two hours',
  rq2: 'Air purification',
  rq3: 'Singapore and Vienna',
  rq4: 'Lower-income neighbourhoods'
};

function checkReading() {
  let score = 0;

  Object.entries(readingAnswers).forEach(([name, correct]) => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (selected && selected.parentElement.textContent.trim() === correct) {
      score++;
    }
  });

  const total = Object.keys(readingAnswers).length;
  const emoji = score === total ? '🎉' : score >= 2 ? '👍' : '💪';
  toast(`You got ${score}/${total} correct! ${emoji}`);
}

/* ─────────────────────────────────────────────
   AUTH — LOGIN / SIGNUP / LOGOUT
───────────────────────────────────────────── */
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const err   = document.getElementById('login-err');

  if (!email || !pass) {
    showErr(err, 'Please fill in all fields.');
    return;
  }
  if (!email.includes('@')) {
    showErr(err, 'Please enter a valid email address.');
    return;
  }

  const users = getUsers();
  const user  = users.find(u => u.email === email && u.pass === pass);

  if (user) {
    saveCurrentUser(user);
    err.style.display = 'none';
    updateNavUI(user);
    go('home');
    toast(`Welcome back, ${user.name}! 👋`);
  } else {
    showErr(err, 'Invalid email or password.');
  }
}

function doSignup() {
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass  = document.getElementById('signup-pass').value;
  const err   = document.getElementById('signup-err');

  if (!name || !email || !pass) {
    showErr(err, 'Please fill in all fields.');
    return;
  }
  if (!email.includes('@')) {
    showErr(err, 'Please enter a valid email address.');
    return;
  }
  if (pass.length < 6) {
    showErr(err, 'Password must be at least 6 characters.');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    showErr(err, 'An account with this email already exists.');
    return;
  }

  const user = { name, email, pass };
  users.push(user);
  localStorage.setItem('ielts-users', JSON.stringify(users));
  saveCurrentUser(user);

  err.style.display = 'none';
  updateNavUI(user);
  go('home');
  toast(`Welcome, ${name}! Account created 🎉`);
}

function doLogout() {
  localStorage.removeItem('ielts-cur');
  updateNavUI(null);
  go('home');
  toast('Logged out successfully.');
}

/* ─── Auth helpers ─── */
function showErr(el, msg) {
  el.style.display = 'block';
  el.textContent   = msg;
}

function getUsers() {
  return JSON.parse(localStorage.getItem('ielts-users') || '[]');
}

function saveCurrentUser(user) {
  localStorage.setItem('ielts-cur', JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('ielts-cur') || 'null');
}

function updateNavUI(user) {
  const el = document.getElementById('nav-auth');
  if (user) {
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;background:var(--gray-100);padding:7px 13px;border-radius:10px;font-size:.84rem;font-weight:600">
        👤 ${user.name}
      </div>
      <span class="btn btn-ghost" style="color:var(--red)" onclick="doLogout()">Logout</span>
    `;
  } else {
    el.innerHTML = `
      <span class="btn btn-ghost" onclick="go('login')">Login</span>
      <span class="btn btn-primary" onclick="go('signup')">Sign Up</span>
    `;
  }
}

/* ─────────────────────────────────────────────
   INIT — run on page load
───────────────────────────────────────────── */
(function init() {
  const user = getCurrentUser();
  if (user) updateNavUI(user);
})();
