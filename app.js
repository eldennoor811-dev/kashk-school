
const loginSection = document.getElementById("loginSection");
const dashboard = document.getElementById("dashboard");
const services = document.getElementById("services");
const contentArea = document.getElementById("contentArea");

let currentUser = null;

const roleNames = {
  student: "طالب",
  teacher: "مدرس",
  supervisor: "رئيس الدور",
  parent: "ولي أمر",
  admin: "المدير / الأدمن"
};

const serviceData = {
  student: [
    ["📅", "جدول الحصص", "schedule"],
    ["📢", "الإعلانات", "news"],
    ["🏆", "لوحة الشرف", "honor"],
    ["📝", "الواجبات", "tasks"]
  ],
  teacher: [
    ["📅", "جدول الحصص", "schedule"],
    ["📋", "تسجيل الغياب", "attendance"],
    ["📌", "المهام اليومية", "tasks"],
    ["📢", "الإعلانات", "news"]
  ],
  supervisor: [
    ["📋", "مراجعة الغياب", "attendance"],
    ["📊", "التقارير", "reports"],
    ["📌", "المهام اليومية", "tasks"],
    ["📢", "الإعلانات", "news"]
  ],
  parent: [
    ["🔔", "متابعة الغياب", "attendance"],
    ["📅", "جدول الابن", "schedule"],
    ["📢", "الإعلانات", "news"],
    ["🏆", "لوحة الشرف", "honor"]
  ],
  admin: [
    ["📢", "نشر إعلان", "news"],
    ["📅", "إدارة الجداول", "schedule"],
    ["📋", "متابعة الغياب", "attendance"],
    ["🏆", "لوحة الشرف", "honor"],
    ["📌", "إدارة المهام", "tasks"],
    ["📊", "التقارير", "reports"]
  ]
};

const students = [
  "طالب تجريبي 1",
  "طالب تجريبي 2",
  "طالب تجريبي 3",
  "طالب تجريبي 4"
];

let attendance = JSON.parse(
  localStorage.getItem("koshkAttendance") || "{}"
);

let announcements = JSON.parse(
  localStorage.getItem("koshkNews") || "[]"
);

let tasks = JSON.parse(
  localStorage.getItem("koshkTasks") || "[]"
);

let honors = JSON.parse(
  localStorage.getItem("koshkHonors") || "[]"
);

function saveData() {
  localStorage.setItem(
    "koshkAttendance",
    JSON.stringify(attendance)
  );

  localStorage.setItem(
    "koshkNews",
    JSON.stringify(announcements)
  );

  localStorage.setItem(
    "koshkTasks",
    JSON.stringify(tasks)
  );

  localStorage.setItem(
    "koshkHonors",
    JSON.stringify(honors)
  );
}

document.getElementById("loginForm").addEventListener(
  "submit",
  function(e) {
    e.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const role = document.getElementById("userRole").value;
    const classroom = document.getElementById("userClass").value;
    const code = document.getElementById("userCode").value;

    if (!name || !role || !code) {
      alert("من فضلك أكمل البيانات");
      return;
    }

    if (
      ["student", "parent", "teacher", "supervisor"].includes(role)
      && !classroom
    ) {
      alert("من فضلك اختر الفصل");
      return;
    }

    // تسجيل تجريبي فقط، وليس نظام دخول حقيقي
    currentUser = {
      name: name,
      role: role,
      classroom: classroom
    };

    openDashboard();
  }
);

function openDashboard() {
  loginSection.classList.add("hidden");
  dashboard.classList.remove("hidden");

  document.getElementById("welcomeName").textContent =
    currentUser.name;

  document.getElementById("welcomeRole").textContent =
    roleNames[currentUser.role] +
    (currentUser.classroom ? " - " + currentUser.classroom : "");

  services.innerHTML = "";

  serviceData[currentUser.role].forEach(item => {
    const card = document.createElement("button");
    card.className = "service-card";

    const icon = document.createElement("div");
    icon.className = "service-icon";
    icon.textContent = item[0];

    const title = document.createElement("h4");
    title.textContent = item[1];

    card.append(icon, title);

    card.addEventListener("click", () => {
      showPage(item[2]);
    });

    services.appendChild(card);
  });

  contentArea.innerHTML =
    "<h3>أهلاً بك في منصة كشك الرقمية</h3>" +
    "<p>اختر الخدمة التي تريد استخدامها.</p>";
}

function showPage(page) {
  contentArea.innerHTML = "";

  const title = document.createElement("h3");

  const pages = {
    schedule: "📅 الجداول الدراسية",
    news: "📢 الإعلانات المدرسية",
    attendance: "📋 نظام الغياب",
    honor: "🏆 لوحة الشرف",
    tasks: "📌 المهام اليومية",
    reports: "📊 التقارير"
  };

  title.textContent = pages[page] || "الخدمة";
  contentArea.appendChild(title);

  if (page === "schedule") {
    showSchedule();
  }

  if (page === "news") {
    showNews();
  }

  if (page === "attendance") {
    showAttendance();
  }

  if (page === "honor") {
    showHonors();
  }

  if (page === "tasks") {
    showTasks();
  }

  if (page === "reports") {
    showReports();
  }
}

function addItem(text) {
  const item = document.createElement("div");
  item.className = "data-item";
  item.textContent = text;
  contentArea.appendChild(item);
}

function showSchedule() {
  addItem("الفصل: " + (currentUser.classroom || "كل الفصول"));
  addItem("جدول الحصص سيضاف بواسطة إدارة المدرسة.");
  addItem("يمكن إضافة ملفات الجداول في النسخة المتصلة بقاعدة البيانات.");
}

function showNews() {
  if (currentUser.role === "admin") {
    const input = document.createElement("input");
    input.placeholder = "اكتب الإعلان الجديد";

    const button = document.createElement("button");
    button.className = "action-btn";
    button.textContent = "نشر الإعلان";

    button.onclick = () => {
      const value = input.value.trim();

      if (!value) {
        alert("اكتب الإعلان أولاً");
        return;
      }

      announcements.push(value);
      saveData();
      showPage("news");
    };

    contentArea.append(input, button);
  }

  if (announcements.length === 0) {
    addItem("لا توجد إعلانات حالياً.");
  } else {
    announcements.forEach(news => addItem("📢 " + news));
  }
}

function showAttendance() {
  if (currentUser.role === "teacher") {
    addItem("كشف الغياب التجريبي");

    students.forEach(student => {
      const row = document.createElement("div");
      row.className = "data-item";

      const name = document.createElement("span");
      name.textContent = student + " ";

      const button = document.createElement("button");
      button.className = "action-btn";
      button.textContent = "تسجيل غياب";

      button.onclick = () => {
        attendance[student] = {
          status: "غائب",
          classroom: currentUser.classroom,
          approved: false,
          date: new Date().toLocaleDateString("ar-EG")
        };

        saveData();
        button.textContent = "تم التسجيل";
        button.disabled = true;
      };

      row.append(name, button);
      contentArea.appendChild(row);
    });

  } else if (
    currentUser.role === "supervisor" ||
    currentUser.role === "admin"
  ) {
    const records = Object.entries(attendance);

    if (records.length === 0) {
      addItem("لا توجد سجلات غياب.");
    }

    records.forEach(([name, record]) => {
      const row = document.createElement("div");
      row.className = "data-item";

      const info = document.createElement("p");
      info.textContent =
        name + " - " + record.classroom + " - " + record.status;

      row.appendChild(info);

      if (!record.approved) {
        const button = document.createElement("button");
        button.className = "action-btn";
        button.textContent = "اعتماد الغياب";

        button.onclick = () => {
          record.approved = true;
          saveData();
          showPage("attendance");
        };

        row.appendChild(button);
      } else {
        const approved = document.createElement("p");
        approved.textContent = "تم الاعتماد";
        approved.className = "status-present";
        row.appendChild(approved);
      }

      contentArea.appendChild(row);
    });

  } else if (currentUser.role === "parent") {
    addItem("سجل غياب الابن سيظهر بعد ربط حساب ولي الأمر بحساب الطالب.");
  } else {
    addItem("خدمة متابعة الغياب.");
  }
}

function showHonors() {
  if (currentUser.role === "admin") {
    const nameInput = document.createElement("input");
    nameInput.placeholder = "اسم الطالب المتفوق";

    const reasonInput = document.createElement("input");
    reasonInput.placeholder = "سبب التكريم";

    const button = document.createElement("button");
    button.className = "action-btn";
    button.textContent = "إضافة للوحة الشرف";

    button.onclick = () => {
      const name = nameInput.value.trim();
      const reason = reasonInput.value.trim();

      if (!name || !reason) {
        alert("اكتب اسم الطالب وسبب التكريم");
        return;
      }

      honors.push({name, reason});
      saveData();
      showPage("honor");
    };

    contentArea.append(nameInput, reasonInput, button);
  }

  if (honors.length === 0) {
    addItem("لم تتم إضافة أسماء إلى لوحة الشرف بعد.");
  }

  honors.forEach(student => {
    addItem("🏅 " + student.name + " - " + student.reason);
  });
}

function showTasks() {
  if (currentUser.role === "admin") {
    const input = document.createElement("input");
    input.placeholder = "اكتب المهمة الجديدة";

    const button = document.createElement("button");
    button.className = "action-btn";
    button.textContent = "إضافة المهمة";

    button.onclick = () => {
      const value = input.value.trim();

      if (!value) {
        alert("اكتب المهمة أولاً");
        return;
      }

      tasks.push({
        title: value,
        done: false
      });

      saveData();
      showPage("tasks");
    };

    contentArea.append(input, button);
  }

  if (tasks.length === 0) {
    addItem("لا توجد مهام حالياً.");
  }

  tasks.forEach((task, index) => {
    const row = document.createElement("div");
    row.className = "data-item";

    const text = document.createElement("p");
    text.textContent =
      task.title + (task.done ? " - تم التنفيذ" : " - لم تنفذ");

    row.appendChild(text);

    if (
      ["teacher", "supervisor"].includes(currentUser.role) &&
      !task.done
    ) {
      const button = document.createElement("button");
      button.className = "action-btn";
      button.textContent = "تم التنفيذ";

      button.onclick = () => {
        tasks[index].done = true;
        saveData();
        showPage("tasks");
      };

      row.appendChild(button);
    }

    contentArea.appendChild(row);
  });
}

function showReports() {
  const records = Object.values(attendance);

  const absent = records.filter(
    record => record.status === "غائب"
  ).length;

  addItem("عدد سجلات الغياب: " + records.length);
  addItem("عدد حالات الغياب: " + absent);
  addItem("عدد الإعلانات: " + announcements.length);
  addItem("عدد المكرمين: " + honors.length);
  addItem("عدد المهام: " + tasks.length);
}

document.getElementById("logoutBtn").onclick = () => {
  currentUser = null;

  dashboard.classList.add("hidden");
  loginSection.classList.remove("hidden");

  document.getElementById("loginForm").reset();
};

