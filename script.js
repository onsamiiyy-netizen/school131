/* =============================================
   CLASS STRUCTURE
   ============================================= */
const CLASS_STRUCTURE = {
  5:  ["А","Б","В","Г","Д","Е","Ж"],
  8:  ["А","Б","В","Г","Д"],
  9:  ["А","Б","В","Г","Д"],
  10: ["А"],
  11: ["А"],
};

const DAYS = ["Понедельник","Вторник","Среда","Четверг","Пятница"];

/* Цветовые группы предметов */
const SUBJECT_COLORS = {
  // Точные науки — синий/циан
  "математика":       "#00e5ff",
  "алгебра":          "#00e5ff",
  "геометрия":        "#00e5ff",
  "информатика":      "#00e5ff",
  // Естественные — зелёный
  "физика":           "#00e676",
  "химия":            "#00e676",
  "биология":         "#00e676",
  "география":        "#69f0ae",
  // Языки — фиолетовый
  "русский язык":     "#ce93d8",
  "литература":       "#ce93d8",
  "английский язык":  "#b39ddb",
  "родной язык":      "#ce93d8",
  "башкирский язык":  "#b39ddb",
  // Гуманитарные — жёлтый
  "история":          "#ffd54f",
  "обществознание":   "#ffd54f",
  // Творчество/труд — оранжевый
  "труд (технология)":"#ffb74d",
  "изо":              "#ffb74d",
  "музыка":           "#ffb74d",
  // Спорт — красный
  "физкультура":      "#ff6090",
  "физическая культура":"#ff6090",
  // Классный час — серый
  "разговоры о важном":"#546e7a",
  // Проект
  "проект":           "#80cbc4",
};

function getSubjectColor(subject) {
  if (!subject) return null;
  const key = subject.toLowerCase().split("/")[0].trim();
  for (const [pattern, color] of Object.entries(SUBJECT_COLORS)) {
    if (key.includes(pattern)) return color;
  }
  return "#7a7a9a"; // дефолт — серый
}



/* =============================================
   DATA STORE
   Урок: { subject: "Математика", room: "48" }
   scheduleData["5А"]["Понедельник"] = [{subject, room}, ...]
   ============================================= */
const scheduleData = {};
Object.entries(CLASS_STRUCTURE).forEach(([grade, letters]) => {
  letters.forEach(letter => {
    const key = grade + letter;
    scheduleData[key] = {};
    DAYS.forEach(day => { scheduleData[key][day] = []; });
  });
});

const data = {
  homework: [
    { subject: "Математика",   task: "Стр. 45, задачи 1-5" },
    { subject: "Русский язык", task: "Написать сочинение на тему «Лето»" },
    { subject: "Физика",       task: "Параграф 12, вопросы 1-3" },
  ],
  news: [
    "📢 В пятницу контрольная по математике!",
    "🏆 Наш класс занял 1 место в олимпиаде по химии!",
    "📅 В следующую среду — экскурсия в музей.",
    "🎉 Не забудьте сдать деньги на поездку до четверга.",
  ],
};

/* =============================================
   STATE
   ============================================= */
let currentRole   = null;
let currentTab    = "schedule";
let currentGrade  = "5";
let currentLetter = "А";
let currentDay    = "Понедельник";

function currentClassKey() { return currentGrade + currentLetter; }

/* =============================================
   AUTH
   ============================================= */
const TEACHER_LOGIN    = "teacher";
const TEACHER_PASSWORD = "123";

const loginOverlay  = document.getElementById("login-overlay");
const loginBtn      = document.getElementById("login-btn");
const loginError    = document.getElementById("login-error");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");
const userBadge     = document.getElementById("user-badge");
const logoutBtn     = document.getElementById("logout-btn");
const teacherFields = document.getElementById("teacher-fields");
const studentFields = document.getElementById("student-fields");

document.querySelectorAll(".role-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".role-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const role = btn.dataset.role;
    teacherFields.style.display = role === "teacher" ? "" : "none";
    studentFields.style.display = role === "student" ? "" : "none";
    loginError.textContent = "";
  });
});

loginBtn.addEventListener("click", doLogin);
[loginUsername, loginPassword].forEach(el =>
  el.addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); })
);

function doLogin() {
  const role = document.querySelector(".role-btn.active").dataset.role;
  if (role === "teacher") {
    const u = loginUsername.value.trim();
    const p = loginPassword.value;
    if (u !== TEACHER_LOGIN || p !== TEACHER_PASSWORD) {
      loginError.textContent = "Неверный логин или пароль";
      loginPassword.value = "";
      loginPassword.focus();
      return;
    }
    currentRole = "teacher";
    userBadge.textContent = "👩‍🏫 Учитель";
    userBadge.className = "user-badge teacher";
  } else {
    currentRole = "student";
    userBadge.textContent = "🎒 Ученик";
    userBadge.className = "user-badge student";
  }
  loginOverlay.classList.add("hidden");
  applyRolePermissions();
}

function doLogout() {
  currentRole = null;
  loginUsername.value = "";
  loginPassword.value = "";
  loginError.textContent = "";
  loginOverlay.classList.remove("hidden");
}

function applyRolePermissions() {
  const isTeacher = currentRole === "teacher";
  document.querySelectorAll(".teacher-only").forEach(el => {
    el.style.display = isTeacher ? "" : "none";
  });
  document.querySelectorAll(".btn-danger").forEach(b => {
    b.style.display = isTeacher ? "" : "none";
  });
}

logoutBtn.addEventListener("click", doLogout);

/* =============================================
   TAB NAVIGATION
   ============================================= */
const titles = {
  schedule: "📅 Расписание",
  homework: "📚 Домашнее задание",
  news:     "📰 Новости",
};

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    switchTab(btn.dataset.tab);
  });
});

document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    switchTab(btn.dataset.tab);
  });
});

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".mobile-nav-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.add("active");
  document.getElementById("page-title").textContent = titles[tab];
}

/* =============================================
   GRADE & LETTER SELECTORS
   ============================================= */
function renderLetterSelector() {
  const letters = CLASS_STRUCTURE[currentGrade] || [];
  const container = document.getElementById("letter-selector");
  container.innerHTML = "";
  if (!letters.includes(currentLetter)) currentLetter = letters[0];
  letters.forEach(letter => {
    const btn = document.createElement("button");
    btn.className = "letter-btn" + (letter === currentLetter ? " active" : "");
    btn.textContent = letter;
    btn.addEventListener("click", () => {
      currentLetter = letter;
      document.querySelectorAll(".letter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderSchedule();
    });
    container.appendChild(btn);
  });
}

document.querySelectorAll(".grade-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentGrade = btn.dataset.grade;
    document.querySelectorAll(".grade-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentLetter = CLASS_STRUCTURE[currentGrade][0];
    renderLetterSelector();
    renderSchedule();
  });
});

document.querySelectorAll(".day-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentDay = btn.dataset.day;
    document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderSchedule();
  });
});

/* =============================================
   RENDER SCHEDULE
   ============================================= */
let dragSrcIndex = null;

function renderSchedule() {
  const key = currentClassKey();
  const lessons = (scheduleData[key] && scheduleData[key][currentDay]) || [];
  const list = document.getElementById("schedule-list");

  document.getElementById("current-class-label").textContent = `${key} — ${currentDay}`;

  list.innerHTML = "";
  if (!lessons.length) {
    list.innerHTML = emptyState("Нет уроков для " + key);
    return;
  }

  const isTeacher = currentRole === "teacher";

  lessons.forEach((lesson, i) => {
    const subject = typeof lesson === "object" ? lesson.subject : lesson;
    const room    = typeof lesson === "object" ? lesson.room    : null;

    const color = getSubjectColor(subject);
    const card = document.createElement("div");
    card.className = "card" + (isTeacher ? " draggable" : "");
    card.dataset.index = i;
    if (color) card.style.setProperty("--subject-color", color);

    if (isTeacher) {
      card.draggable = true;

      card.addEventListener("dragstart", e => {
        dragSrcIndex = i;
        card.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        document.querySelectorAll(".card.drag-over").forEach(c => c.classList.remove("drag-over"));
      });

      card.addEventListener("dragover", e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragSrcIndex !== i) card.classList.add("drag-over");
      });

      card.addEventListener("dragleave", () => {
        card.classList.remove("drag-over");
      });

      card.addEventListener("drop", e => {
        e.preventDefault();
        card.classList.remove("drag-over");
        if (dragSrcIndex === null || dragSrcIndex === i) return;

        const arr = scheduleData[currentClassKey()][currentDay];
        const moved = arr.splice(dragSrcIndex, 1)[0];
        arr.splice(i, 0, moved);
        dragSrcIndex = null;
        renderSchedule();
      });
    }

    card.innerHTML = `
      <div class="card-left">
        ${isTeacher ? '<span class="drag-handle teacher-only">⠿</span>' : ""}
        <div class="subject-dot" style="background:var(--subject-color, #7a7a9a)"></div>
        <div class="card-num">${i + 1}</div>
        <div class="card-text">
          <span class="lesson-subject" style="color:var(--subject-color, var(--text))">${subject}</span>
        </div>
      </div>
      <div class="card-right">
        ${room ? `<span class="room-badge-right">${room}</span>` : ""}
        <div class="card-actions teacher-only">
          <button class="btn-edit" onclick="editLesson(${i})" title="Редактировать">✏️</button>
          <button class="btn-danger" onclick="deleteLesson(${i})">✕</button>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
  if (currentRole) applyRolePermissions();
}

function deleteLesson(idx) {
  const lesson = scheduleData[currentClassKey()][currentDay][idx];
  const subject = typeof lesson === "object" ? lesson.subject : lesson;

  openModal(
    "Удалить урок?",
    `<div class="delete-confirm">
      <div class="delete-confirm-icon">🗑️</div>
      <p>Вы уверены, что хотите удалить урок<br><strong>${subject}</strong>?</p>
    </div>`,
    () => {
      scheduleData[currentClassKey()][currentDay].splice(idx, 1);
      renderSchedule();
    }
  );
  // Поменяем текст кнопки сохранения на "Удалить"
  setTimeout(() => {
    const saveBtn = document.getElementById("modal-save");
    if (saveBtn) {
      saveBtn.textContent = "Удалить";
      saveBtn.classList.add("btn-save-danger");
    }
  }, 10);
}

function editLesson(idx) {
  const lesson = scheduleData[currentClassKey()][currentDay][idx];
  const subject = typeof lesson === "object" ? lesson.subject : lesson;
  const room    = typeof lesson === "object" ? lesson.room    : "";

  openModal(
    `Редактировать урок №${idx + 1}`,
    `<div><label>Название урока</label>
     <input id="m-lesson" type="text" value="${subject}" placeholder="Например: Математика"/></div>
     <div><label>Кабинет (необязательно)</label>
     <input id="m-room" type="text" value="${room}" placeholder="Например: 48"/></div>`,
    () => {
      const newSubject = document.getElementById("m-lesson").value.trim();
      const newRoom    = document.getElementById("m-room").value.trim();
      if (!newSubject) return;
      scheduleData[currentClassKey()][currentDay][idx] = { subject: newSubject, room: newRoom };
      renderSchedule();
    }
  );
  // Autofocus and select text for quick editing
  setTimeout(() => {
    const input = document.getElementById("m-lesson");
    if (input) { input.focus(); input.select(); }
  }, 50);
}

/* =============================================
   RENDER HOMEWORK
   ============================================= */
function renderHomework() {
  const homeworkList = document.getElementById("homework-list");
  homeworkList.innerHTML = "";
  if (!data.homework.length) { homeworkList.innerHTML = emptyState("Нет домашних заданий"); return; }
  data.homework.forEach((hw, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-left">
        <div class="card-num">${i + 1}</div>
        <div class="card-text">
          <span class="card-subject">${hw.subject}</span>
          ${hw.task}
        </div>
      </div>
      <button class="btn-danger teacher-only" onclick="deleteHomework(${i})">✕</button>
    `;
    homeworkList.appendChild(card);
  });
  if (currentRole) applyRolePermissions();
}

function deleteHomework(idx) {
  data.homework.splice(idx, 1);
  renderHomework();
}

/* =============================================
   RENDER NEWS
   ============================================= */
function renderNews() {
  const newsList = document.getElementById("news-list");
  newsList.innerHTML = "";
  if (!data.news.length) { newsList.innerHTML = emptyState("Нет новостей"); return; }
  data.news.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "card news-card";
    card.innerHTML = `
      <div class="card-left">
        <div class="card-num">${i + 1}</div>
        <div class="card-text">${item}</div>
      </div>
      <button class="btn-danger teacher-only" onclick="deleteNews(${i})">✕</button>
    `;
    newsList.appendChild(card);
  });
  if (currentRole) applyRolePermissions();
}

function deleteNews(idx) {
  data.news.splice(idx, 1);
  renderNews();
}

/* =============================================
   EMPTY STATE
   ============================================= */
function emptyState(msg) {
  return `<div class="empty-state"><div class="empty-icon">🗂</div><p>${msg}</p></div>`;
}

/* =============================================
   MODAL
   ============================================= */
const addBtn       = document.getElementById("add-btn");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose   = document.getElementById("modal-close");
const modalCancel  = document.getElementById("modal-cancel");
const modalSave    = document.getElementById("modal-save");
const modalTitle   = document.getElementById("modal-title");
const modalBody    = document.getElementById("modal-body");

addBtn.addEventListener("click", () => {
  if (currentTab === "schedule") openScheduleModal();
  else if (currentTab === "homework") openHomeworkModal();
  else if (currentTab === "news") openNewsModal();
});

function openModal(title, bodyHTML, onSave) {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHTML;
  modalOverlay.classList.add("open");
  modalSave.onclick = () => { onSave(); closeModal(); };
}

function closeModal() { modalOverlay.classList.remove("open"); }

modalClose.addEventListener("click", closeModal);
modalCancel.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });

function openScheduleModal() {
  openModal(
    `Добавить урок — ${currentClassKey()}, ${currentDay}`,
    `<div><label>Название урока</label>
     <input id="m-lesson" type="text" placeholder="Например: Математика"/></div>
     <div><label>Кабинет (необязательно)</label>
     <input id="m-room" type="text" placeholder="Например: 48"/></div>`,
    () => {
      const subject = document.getElementById("m-lesson").value.trim();
      const room    = document.getElementById("m-room").value.trim();
      if (!subject) return;
      scheduleData[currentClassKey()][currentDay].push({ subject, room });
      renderSchedule();
    }
  );
}

function openHomeworkModal() {
  openModal(
    "Добавить домашнее задание",
    `<div><label>Предмет</label>
     <input id="m-subject" type="text" placeholder="Например: Математика"/></div>
     <div><label>Задание</label>
     <textarea id="m-task" rows="3" placeholder="Например: Стр. 45, задачи 1-5"></textarea></div>`,
    () => {
      const subject = document.getElementById("m-subject").value.trim();
      const task    = document.getElementById("m-task").value.trim();
      if (!subject || !task) return;
      data.homework.push({ subject, task });
      renderHomework();
    }
  );
}

function openNewsModal() {
  openModal(
    "Добавить новость",
    `<div><label>Текст новости</label>
     <textarea id="m-news" rows="3" placeholder="Например: 📢 В пятницу контрольная!"></textarea></div>`,
    () => {
      const val = document.getElementById("m-news").value.trim();
      if (!val) return;
      data.news.push(val);
      renderNews();
    }
  );
}




// ===== ПОНЕДЕЛЬНИК — предзаполненные данные с фото =====
function prefillMonday() {
  const d = scheduleData;
  const M = "Понедельник";

  // 5А
  d["5А"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"История", room:"53"},
    {subject:"Родной язык", room:"48/49"},
    {subject:"Английский язык", room:"39/25"},
    {subject:"Русский язык", room:"48"},
    {subject:"Труд (технология)", room:""},
    {subject:"Труд (технология)", room:""},
  ];

  // 5Б
  d["5Б"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Труд (технология)", room:""},
    {subject:"Труд (технология)", room:"55"},
    {subject:"Русский язык", room:"25"},
    {subject:"История", room:"53"},
    {subject:"Английский язык", room:"39/25"},
    {subject:"Родной язык", room:"К05/29"},
  ];

  // 5В
  d["5В"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Родной язык", room:""},
    {subject:"Литература", room:"55"},
    {subject:"Труд (технология)", room:""},
    {subject:"Труд (технология)", room:""},
    {subject:"История", room:"53"},
    {subject:"Английский язык", room:"39/25"},
  ];

  // 5Г
  d["5Г"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Английский язык", room:"55/49"},
    {subject:"Математика", room:"8"},
    {subject:"Математика", room:"8"},
    {subject:"Русский язык", room:"55/"},
    {subject:"Родной язык", room:""},
    {subject:"История", room:"56"},
  ];

  // 5Д
  d["5Д"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Литература", room:"39/25"},
    {subject:"Русский язык", room:"56"},
    {subject:"Английский язык", room:"39/25"},
    {subject:"Английский язык", room:"39/25"},
    {subject:"История", room:"34"},
    {subject:"Родной язык", room:"56/49"},
  ];

  // 5Е
  d["5Е"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Математика", room:"8"},
    {subject:"Английский язык", room:"39/25"},
    {subject:"История", room:"34"},
    {subject:"Русский язык", room:"56"},
    {subject:"Литература", room:"56"},
    {subject:"Родной язык", room:"56/49"},
  ];

  // 8А
  d["8А"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Литература", room:"48"},
    {subject:"Геометрия", room:"37"},
    {subject:"Химия", room:"33"},
    {subject:"нет", room:""},
    {subject:"История", room:"34"},
    {subject:"Алгебра", room:"37"},
    {subject:"Английский язык", room:"41"},
  ].filter(l => l.subject !== "нет");

  // 8Б
  d["8Б"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Английский язык", room:"33"},
    {subject:"нет", room:""},
    {subject:"История", room:"34"},
    {subject:"Алгебра", room:"37"},
    {subject:"Химия", room:"33"},
    {subject:"Литература", room:"51"},
  ].filter(l => l.subject !== "нет");

  // 8В
  d["8В"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Английский язык", room:"41"},
    {subject:"Алгебра", room:"36"},
    {subject:"Русский язык", room:"51"},
    {subject:"История", room:"53"},
    {subject:"Химия", room:"33"},
    {subject:"Литература", room:"51"},
  ];

  // 8Г
  d["8Г"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Химия", room:"34"},
    {subject:"Родной язык", room:"36"},
    {subject:"Алгебра", room:"51"},
    {subject:"нет", room:""},
    {subject:"Литература", room:"48"},
    {subject:"Английский язык", room:"39/38"},
  ].filter(l => l.subject !== "нет");

  // 8Д
  d["8Д"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"История", room:"51"},
    {subject:"Геометрия", room:"37"},
    {subject:"Химия", room:"33"},
    {subject:"Русский язык", room:"51"},
    {subject:"нет", room:""},
    {subject:"Алгебра", room:"37"},
  ].filter(l => l.subject !== "нет");

  // 9А
  d["9А"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Башкирский язык/Информатика", room:"47/29"},
    {subject:"География", room:"52"},
    {subject:"Алгебра", room:"36"},
    {subject:"Башкирский язык/Информатика", room:"47/49"},
    {subject:"Физика", room:"45"},
  ];

  // 9Б
  d["9Б"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Алгебра", room:"36"},
    {subject:"Литература", room:"51"},
    {subject:"Башкирский язык/Информатика", room:"47/29"},
    {subject:"География", room:"52"},
    {subject:"Физика", room:"45"},
    {subject:"Башкирский язык/Информатика", room:"47/49"},
  ];

  // 9В
  d["9В"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Физика", room:"45"},
    {subject:"География", room:"52"},
    {subject:"Химия", room:"31"},
    {subject:"Башкирский язык/Информатика", room:"47/29"},
    {subject:"Английский язык", room:"43/38"},
    {subject:"Башкирский язык/Информатика", room:"47/49"},
    {subject:"Русский язык", room:"48"},
  ];

  // 9Г
  d["9Г"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"География", room:"41"},
    {subject:"Химия", room:"31"},
    {subject:"Физика", room:"45"},
    {subject:"Английский язык", room:"43/38"},
    {subject:"Литература", room:"54"},
    {subject:"Русский язык", room:"54"},
    {subject:"Алгебра", room:"36"},
  ];

  // 9Д
  d["9Д"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Алгебра", room:"37"},
    {subject:"Русский язык", room:"54"},
    {subject:"Английский язык", room:"38"},
    {subject:"Физика", room:"45"},
    {subject:"Химия", room:"31"},
    {subject:"География", room:"52"},
    {subject:"Литература", room:"54"},
  ];

  // 10А
  d["10А"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"География", room:"52"},
    {subject:"Обществознание", room:"53"},
    {subject:"Литература", room:"52"},
    {subject:"Химия", room:"41"},
    {subject:"Геометрия", room:"37"},
    {subject:"Алгебра", room:"37"},
    {subject:"Проект", room:"акт.зал"},
  ];

  // 11А
  d["11А"][M] = [
    {subject:"Разговоры о важном", room:""},
    {subject:"Литература", room:"54"},
    {subject:"Физика", room:"45"},
    {subject:"Обществознание", room:"53"},
    {subject:"Русский язык", room:"54"},
    {subject:"География", room:"52"},
    {subject:"Химия", room:"41"},
    {subject:"Обществознание", room:"53"},
  ];
}
prefillMonday();

/* =============================================
   INIT
   ============================================= */
renderLetterSelector();
renderSchedule();
renderHomework();
renderNews();
