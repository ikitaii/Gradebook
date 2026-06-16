import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProgramRequest, createProgramRequest } from "../api/program";
import { getSubjectsRequest } from "../api/subject";

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
  const [subjectName, setSubjectName] = useState("");
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
      const [program, subjects] = await Promise.all([
        getProgramRequest(subjectId),
        getSubjectsRequest(),
      ]);
      setItems(program);
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
    </MainLayout>
  );
}
