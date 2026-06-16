import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getSubjectsRequest,
  createSubjectRequest,
  updateSubjectRequest,
  deleteSubjectRequest,
} from "../api/subject";

type Subject = { id: number; name: string };

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await getSubjectsRequest();
      setSubjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredSubjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) => s.name.toLowerCase().includes(q));
  }, [subjects, search]);

  const handleAddSubject = async () => {
    if (!newName.trim()) return;
    try {
      await createSubjectRequest(newName.trim());
      setNewName("");
      loadSubjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingSubject || !editName.trim()) return;
    try {
      await updateSubjectRequest(editingSubject.id, editName.trim());
      setEditingSubject(null);
      loadSubjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Удалить предмет?")) return;
    try {
      await deleteSubjectRequest(id);
      loadSubjects();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Предметы</h1>
        <p className="text-gray-500 mt-1">Список учебных дисциплин</p>
      </div>

      <input
        type="text"
        placeholder="Поиск предмета"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 outline-none focus:border-black"
      />

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Добавить предмет</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Название"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
          />
          <button
            onClick={handleAddSubject}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
          >
            Добавить
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">ID</th>
              <th className="text-left px-6 py-4 font-semibold">Название</th>
              <th className="text-right px-6 py-4 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">{subject.id}</td>
                <td className="px-6 py-4 font-medium">{subject.name}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingSubject(subject);
                      setEditName(subject.name);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSubjects.length === 0 && (
          <div className="p-10 text-center text-gray-500">Предметы не найдены</div>
        )}
      </div>

      {editingSubject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Редактировать предмет</h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingSubject(null)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 rounded-lg bg-black text-white"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
