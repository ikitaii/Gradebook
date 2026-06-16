import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";
import {
  getLabByIdRequest,
  uploadLabFileRequest,
  submitLabRequest,
} from "../api/labs";

type LabDetail = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  issuedAt: string | null;
  materialUrl: string | null;
  subject: { id: number; name: string };
  teacher: { user: { fullName: string } };
  team: {
    id: number;
    name: string;
    members: { id: number; fullName: string }[];
  } | null;
  submission: {
    id: number;
    fileUrl: string;
    grade?: number;
    comment?: string;
    checked: boolean;
  } | null;
};

export default function StudentLabDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lab, setLab] = useState<LabDetail | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const load = () => {
    if (!id) return;
    getLabByIdRequest(Number(id))
      .then(setLab)
      .catch(console.error);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleSubmit = async () => {
    if (!lab) return;
    try {
      let fileUrl = linkUrl.trim();
      if (file) {
        const uploaded = await uploadLabFileRequest(file);
        fileUrl = uploaded.fileUrl;
      }
      if (!fileUrl) {
        toast.error("Укажите ссылку или выберите файл");
        return;
      }
      await submitLabRequest(lab.id, fileUrl);
      toast.success("Работа отправлена");
      load();
    } catch (e) {
      console.error(e);
      toast.error("Ошибка отправки");
    }
  };

  if (!lab) {
    return (
      <MainLayout>
        <div className="text-xl font-bold">Загрузка...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Link to="/labs" className="text-sm text-gray-500 hover:text-black">
        ← К лабораторным
      </Link>

      <h1 className="text-3xl font-bold mt-2">{lab.title}</h1>
      <p className="text-gray-500 mt-1">{lab.subject.name}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Информация</h2>
          <div className="text-sm space-y-2">
            <p>
              <span className="font-medium">Преподаватель:</span>{" "}
              {lab.teacher.user.fullName}
            </p>
            {lab.issuedAt && (
              <p>
                <span className="font-medium">Дата выдачи:</span>{" "}
                {new Date(lab.issuedAt).toLocaleDateString("ru-RU")}
              </p>
            )}
            <p>
              <span className="font-medium">Дедлайн:</span>{" "}
              {new Date(lab.deadline).toLocaleString("ru-RU")}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Теоретические материалы</h3>
            <p className="text-sm text-gray-700">{lab.description}</p>
            {lab.materialUrl && (
              <a
                href={lab.materialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm mt-2 inline-block"
              >
                Скачать ТЗ / материалы →
              </a>
            )}
          </div>

          {lab.team && (
            <div>
              <h3 className="font-medium mb-2">Напарники</h3>
              <p className="text-sm text-gray-500 mb-2">{lab.team.name}</p>
              <ul className="space-y-1">
                {lab.team.members.map((m) => (
                  <li key={m.id} className="text-sm bg-gray-50 rounded-lg px-3 py-2">
                    {m.fullName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-4">Ваше решение</h2>

          {lab.submission ? (
            <div className="space-y-3 text-sm">
              <p>
                Статус:{" "}
                <span className="font-semibold">
                  {lab.submission.checked ? "Проверено" : "На проверке"}
                </span>
              </p>
              <a
                href={`http://localhost:5000${lab.submission.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 block"
              >
                Открыть отправленное решение
              </a>
              {lab.submission.checked && (
                <>
                  <p>
                    Оценка: <strong>{lab.submission.grade}</strong>
                  </p>
                  {lab.submission.comment && (
                    <p className="bg-gray-50 rounded-xl p-4">
                      {lab.submission.comment}
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Ссылка на решение (GitHub, Drive...)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-sm"
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full border rounded-xl p-2 text-sm bg-gray-50"
              />
              <button
                onClick={handleSubmit}
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
              >
                Прикрепить решение
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
