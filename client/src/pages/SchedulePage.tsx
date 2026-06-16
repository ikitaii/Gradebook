import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../entities/auth/auth.store";
import {
  getScheduleRequest,
  createScheduleRequest,
  updateScheduleRequest,
  deleteScheduleRequest,
  type ScheduleItem,
} from "../api/schedule";
import { getGroupsRequest } from "../api/groups";
import { getSubjectsRequest } from "../api/subject";
import { getTeachersRequest } from "../api/teachers";

const DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

type GroupType = { id: number; name: string };
type SubjectType = { id: number; name: string };
type TeacherType = { id: number; fullName: string };

const emptyForm = {
  groupId: "",
  subjectId: "",
  teacherId: "",
  dayOfWeek: "Понедельник",
  startTime: "09:00",
  endTime: "10:30",
  room: "",
};

export default function SchedulePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [scheduleData, groupsData, subjectsData, teachersData] = await Promise.all([
        getScheduleRequest(),
        getGroupsRequest(),
        getSubjectsRequest(),
        getTeachersRequest(),
      ]);
      setSchedules(scheduleData);
      setGroups(groupsData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
    } catch (error) {
      console.error(error);
    }
  };

  const groupedByDay = useMemo(() => {
    const map: Record<string, ScheduleItem[]> = {};
    DAYS.forEach((d) => (map[d] = []));
    schedules.forEach((s) => {
      if (!map[s.dayOfWeek]) map[s.dayOfWeek] = [];
      map[s.dayOfWeek].push(s);
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
    return map;
  }, [schedules]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setForm({
      groupId: String(item.group.id),
      subjectId: String(item.subject.id),
      teacherId: String(item.teacher.id),
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      groupId: Number(form.groupId),
      subjectId: Number(form.subjectId),
      teacherId: Number(form.teacherId),
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
      room: form.room,
    };
    try {
      if (editingId) {
        await updateScheduleRequest(editingId, payload);
      } else {
        await createScheduleRequest(payload);
      }
      setModalOpen(false);
      loadAll();
    } catch (error) {
      console.error(error);
      alert("Ошибка сохранения расписания");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Удалить пару из расписания?")) return;
    try {
      await deleteScheduleRequest(id);
      loadAll();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Расписание</h1>
          <p className="text-gray-500 mt-1">
            {isAdmin
              ? "Глобальное расписание пар по группам"
              : "Расписание занятий"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
          >
            Добавить пару
          </button>
        )}
      </div>

      <div className="flex flex-col gap-8">
        {DAYS.map((day) => {
          const dayItems = groupedByDay[day] || [];
          if (dayItems.length === 0 && !isAdmin) return null;
          return (
            <div key={day}>
              <h2 className="text-2xl font-bold mb-4">{day}</h2>
              {dayItems.length === 0 ? (
                <p className="text-gray-400 text-sm">Нет пар</p>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xl font-bold">{item.subject.name}</div>
                          <div className="text-gray-500 mt-1">
                            {item.startTime} — {item.endTime}
                            {item.room && ` · ауд. ${item.room}`}
                          </div>
                          <div className="mt-3 text-sm text-gray-700 space-y-1">
                            <div>
                              <span className="font-semibold">Группа:</span>{" "}
                              {item.group.name}
                            </div>
                            <div>
                              <span className="font-semibold">Преподаватель:</span>{" "}
                              {item.teacher.user.fullName}
                            </div>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(item)}
                              className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg"
                            >
                              Изм.
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg"
                            >
                              Удал.
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {schedules.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500">
            Расписание пусто. {isAdmin && "Добавьте пары через кнопку выше."}
          </div>
        )}
      </div>

      {modalOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Редактировать пару" : "Новая пара"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={form.groupId}
                onChange={(e) => setForm({ ...form, groupId: e.target.value })}
                className="w-full border rounded-xl px-4 py-3"
                required
              >
                <option value="">Группа</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <select
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                className="w-full border rounded-xl px-4 py-3"
                required
              >
                <option value="">Предмет</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <select
                value={form.teacherId}
                onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                className="w-full border rounded-xl px-4 py-3"
                required
              >
                <option value="">Преподаватель</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
              <select
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                className="w-full border rounded-xl px-4 py-3"
                required
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="border rounded-xl px-4 py-3"
                  required
                />
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="border rounded-xl px-4 py-3"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Аудитория"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                className="w-full border rounded-xl px-4 py-3"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-black text-white"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
