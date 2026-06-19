import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProgramRequest, createProgramRequest } from "../api/program";
import { getSubjectsRequest } from "../api/subject";
import {
  getLabTeamCandidatesRequest,
  getLabsRequest,
  upsertLabTeamRequest,
  type LabListItem,
} from "../api/labs";

type ProgramItem = {
  id: number;
  title: string;
  description: string;
  type: string;
  materialUrl: string | null;
  deadline: string | null;
  teamWork: boolean;
};

const TYPES = [
  { value: "LAB", label: "Лабораторная" },
  { value: "THEORY", label: "Теория" },
  { value: "PRACTICE", label: "Практика" },
  { value: "TEST", label: "Контрольная / тест" },
];

export default function TeacherProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const subjectId = Number(id);
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [labs, setLabs] = useState<LabListItem[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<LabListItem | null>(null);
  const [teamName, setTeamName] = useState("");
  const [candidateStudents, setCandidateStudents] = useState<
    Array<{ id: number; fullName: string; expelled: boolean; isNew: boolean }>
  >([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamSaving, setTeamSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "LAB",
    materialUrl: "",
    deadline: "",
    teamWork: false,
  });

  const load = async () => {
    try {
      const [program, subjects, labsData] = await Promise.all([
        getProgramRequest(subjectId),
        getSubjectsRequest(),
        getLabsRequest(),
      ]);
      setItems(program);
      setLabs((labsData || []).filter((lab) => lab.subjectId === subjectId));
      const sub = subjects.find((s: { id: number }) => s.id === subjectId);
      setSubjectName(sub?.name || "");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (subjectId) load();
  }, [subjectId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await createProgramRequest({
        subjectId,
        title: form.title.trim(),
        description: form.description,
        type: form.type,
        materialUrl: form.materialUrl,
        deadline: form.deadline || "",
        teamWork: form.teamWork,
      });
      setForm({
        title: "",
        description: "",
        type: "LAB",
        materialUrl: "",
        deadline: "",
        teamWork: false,
      });
      load();
    } catch (e) {
      console.error(e);
      alert("Ошибка создания элемента");
    }
  };

  const openTeamModal = async (lab: LabListItem) => {
    setSelectedLab(lab);
    setTeamModalOpen(true);
    setTeamLoading(true);
    setCandidateStudents([]);
    setSelectedStudentIds([]);
    setTeamName("");
    try {
      const data = await getLabTeamCandidatesRequest(lab.id);
      setCandidateStudents(data.students || []);
      setSelectedStudentIds(data.team?.studentIds || []);
      setTeamName(data.team?.name || `Команда — ${lab.title}`);
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить данные для настройки команды");
      setTeamModalOpen(false);
    } finally {
      setTeamLoading(false);
    }
  };

  const toggleStudent = (studentId: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const saveTeam = async () => {
    if (!selectedLab) return;
    if (selectedStudentIds.length < 2) {
      alert("Для командной лабораторной нужно выбрать минимум 2 студентов");
      return;
    }
    try {
      setTeamSaving(true);
      await upsertLabTeamRequest(selectedLab.id, {
        name: teamName.trim(),
        studentIds: selectedStudentIds,
      });
      setTeamModalOpen(false);
      setSelectedLab(null);
      await load();
    } catch (error) {
      console.error(error);
      alert("Ошибка сохранения команды");
    } finally {
      setTeamSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <Link to="/subject" className="text-sm text-gray-500 hover:text-black">
          ← К списку предметов
        </Link>
        <h1 className="text-3xl font-bold mt-2">{subjectName || "Программа"}</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Добавить элемент программы</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Название *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border rounded-xl px-4 py-3"
            required
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border rounded-xl px-4 py-3"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <textarea
            placeholder="Описание / комментарий"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-xl px-4 py-3 md:col-span-2"
            rows={2}
          />
          <input
            placeholder="Ссылка на ТЗ / материалы"
            value={form.materialUrl}
            onChange={(e) => setForm({ ...form, materialUrl: e.target.value })}
            className="border rounded-xl px-4 py-3"
          />
          <input
            type="datetime-local"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="border rounded-xl px-4 py-3"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.teamWork}
              onChange={(e) => setForm({ ...form, teamWork: e.target.checked })}
            />
            Командная работа
          </label>
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 md:col-span-2"
          >
            Добавить
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-2xl p-5"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="font-bold text-lg">{item.title}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {TYPES.find((t) => t.value === item.type)?.label || item.type}
                  {item.teamWork && " · командная"}
                </div>
                {item.description && (
                  <p className="text-sm mt-2 text-gray-700">{item.description}</p>
                )}
                {item.deadline && (
                  <p className="text-sm text-gray-500 mt-1">
                    Дедлайн: {new Date(item.deadline).toLocaleString("ru-RU")}
                  </p>
                )}
                {item.materialUrl && (
                  <a
                    href={item.materialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 mt-1 block"
                  >
                    Материалы / ТЗ
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center text-gray-500 py-8">Элементы программы не добавлены</div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Командные лабораторные</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {labs.map((lab) => (
            <div key={lab.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="font-bold text-lg">{lab.title}</div>
              <div className="text-sm text-gray-500 mt-1">
                {lab.groupName ? `Группа: ${lab.groupName}` : "Группа не указана"}
              </div>
              <div className="text-sm text-gray-500">
                Дедлайн: {new Date(lab.deadline).toLocaleString("ru-RU")}
              </div>
              <button
                onClick={() => openTeamModal(lab)}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Настроить команду
              </button>
            </div>
          ))}
        </div>
        {labs.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Для этого предмета пока нет лабораторных работ
          </div>
        )}
      </div>

      {teamModalOpen && selectedLab && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-1">Команда для лабораторной</h3>
            <p className="text-gray-500 mb-4">{selectedLab.title}</p>
            {teamLoading ? (
              <div className="text-gray-500">Загрузка...</div>
            ) : (
              <>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Название команды"
                  className="w-full border rounded-xl px-4 py-3 mb-4"
                />
                <div className="max-h-80 overflow-auto border rounded-xl p-3 space-y-2">
                  {candidateStudents.map((student) => {
                    const checked = selectedStudentIds.includes(student.id);
                    return (
                      <label
                        key={student.id}
                        className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleStudent(student.id)}
                            disabled={student.expelled}
                          />
                          <span className={student.expelled ? "text-gray-400 line-through" : ""}>
                            {student.fullName}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.expelled ? "Отчислен" : student.isNew ? "Новый" : ""}
                        </div>
                      </label>
                    );
                  })}
                  {candidateStudents.length === 0 && (
                    <div className="text-sm text-gray-500">Нет доступных студентов</div>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-3">
                  Выбрано: {selectedStudentIds.length} (минимум 2)
                </div>
              </>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setTeamModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={saveTeam}
                disabled={teamLoading || teamSaving}
                className="px-6 py-2 rounded-lg bg-black text-white disabled:opacity-50"
              >
                {teamSaving ? "Сохранение..." : "Сохранить команду"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
