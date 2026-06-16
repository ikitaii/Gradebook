import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";
import {
  getLabsRequest,
  getMySubmissionsRequest,
  uploadLabFileRequest,
  submitLabRequest,
} from "../api/labs";

type Lab = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  subject: string;
};

type Submission = {
  id: number;
  lab: { id: number };
  fileUrl: string;
  grade?: number;
  comment?: string;
  checked: boolean;
  createdAt: string;
};

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [linkUrls, setLinkUrls] = useState<Record<number, string>>({});
  const [files, setFiles] = useState<Record<number, File | null>>({});

  const load = async () => {
    try {
      const [labsData, subs] = await Promise.all([
        getLabsRequest(),
        getMySubmissionsRequest(),
      ]);
      setLabs(labsData);
      setSubmissions(subs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getSubmission = (labId: number) =>
    submissions.find((s) => s.lab.id === labId);

  const handleSubmit = async (labId: number) => {
    try {
      let fileUrl = linkUrls[labId]?.trim();
      const file = files[labId];
      if (file) {
        const uploaded = await uploadLabFileRequest(file);
        fileUrl = uploaded.fileUrl;
      }
      if (!fileUrl) {
        toast.error("Укажите ссылку или выберите файл");
        return;
      }
      await submitLabRequest(labId, fileUrl);
      toast.success("Работа отправлена");
      load();
    } catch (e) {
      console.error(e);
      toast.error("Ошибка отправки");
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Лабораторные работы</h1>
        <p className="text-gray-500 mt-1">Сдача и статус проверки</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {labs.map((lab) => {
          const sub = getSubmission(lab.id);
          const isLate =
            sub && new Date(sub.createdAt) > new Date(lab.deadline);

          return (
            <div
              key={lab.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start gap-2">
                <h2 className="text-xl font-semibold">{lab.title}</h2>
                {isLate && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    Просрочено
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">{lab.subject}</p>
              {lab.description && (
                <p className="text-sm mt-3 text-gray-700">{lab.description}</p>
              )}
              <p className="text-sm mt-2">
                <span className="font-semibold">Дедлайн:</span>{" "}
                {new Date(lab.deadline).toLocaleString("ru-RU")}
              </p>

              {sub ? (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm space-y-2">
                  <div>
                    Статус:{" "}
                    <span className="font-semibold">
                      {sub.checked ? "Проверено" : "На проверке"}
                    </span>
                  </div>
                  {sub.checked && (
                    <>
                      <div>Оценка: <strong>{sub.grade}</strong></div>
                      {sub.comment && <div>Комментарий: {sub.comment}</div>}
                    </>
                  )}
                  <a
                    href={`http://localhost:5000${sub.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 block"
                  >
                    Ваше решение
                  </a>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Ссылка на решение (GitHub, Drive...)"
                    value={linkUrls[lab.id] || ""}
                    onChange={(e) =>
                      setLinkUrls({ ...linkUrls, [lab.id]: e.target.value })
                    }
                    className="w-full border rounded-xl px-4 py-2 text-sm"
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      setFiles({
                        ...files,
                        [lab.id]: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full border rounded-xl p-2 text-sm bg-gray-50"
                  />
                  <button
                    onClick={() => handleSubmit(lab.id)}
                    className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-gray-800"
                  >
                    Отправить решение
                  </button>
                </div>
              )}

              <Link
                to={`/labs/${lab.id}`}
                className="text-sm text-blue-600 mt-4 block"
              >
                Подробнее →
              </Link>
            </div>
          );
        })}
      </div>

      {labs.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          Лабораторные работы не назначены
        </div>
      )}
    </MainLayout>
  );
}
