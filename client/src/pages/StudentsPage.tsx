import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getStudentsRequest,
  createStudentRequest,
  updateStudentRequest,
  deleteStudentRequest,
  type Student,
} from "../api/students";
import { getGroupsRequest } from "../api/groups";

type Group = { id: number; name: string };

const emptyForm = {
  fullName: "",
  login: "",
  password: "",
  groupId: "",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudents();
    loadGroups();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudentsRequest();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить список студентов");
    }
  };

  const loadGroups = async () => {
    try {
      const data = await getGroupsRequest();
      setGroups(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.user.fullName.toLowerCase().includes(q) ||
        s.user.login.toLowerCase().includes(q) ||
        s.group.name.toLowerCase().includes(q)
    );
  }, [students, search]);

  const openCreateModal = () => {
    setEditingStudent(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setForm({
      fullName: student.user.fullName,
      login: student.user.login,
      password: "",
      groupId: String(student.group.id),
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const groupId = parseInt(form.groupId, 10);
    if (!form.fullName.trim() || !form.login.trim() || !groupId) {
      setError("Заполните все обязательные поля и выберите группу");
      return;
    }

    try {
      if (editingStudent) {
        await updateStudentRequest(editingStudent.id, {
          fullName: form.fullName.trim(),
          login: form.login.trim(),
          groupId,
        });
      } else {
        if (!form.password.trim()) {
          setError("Укажите пароль для нового студента");
          return;
        }
        await createStudentRequest({
          fullName: form.fullName.trim(),
          login: form.login.trim(),
          password: form.password,
          groupId,
        });
      }
      setModalOpen(false);
      loadStudents();
    } catch (err) {
      console.error(err);
      setError("Ошибка сохранения студента");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Удалить студента?")) return;
    try {
      await deleteStudentRequest(id);
      loadStudents();
    } catch (err) {
      console.error(err);
      setError("Ошибка удаления");
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Студенты</h1>
          <p className="text-gray-500 mt-1">Управление студентами и привязка к группам</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
        >
          Добавить студента
        </button>
      </div>

      <input
        type="text"
        placeholder="Поиск по ФИО, логину или группе"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 outline-none focus:border-black"
      />

      {error && !modalOpen && (
        <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">ID</th>
              <th className="text-left px-6 py-4 font-semibold">ФИО</th>
              <th className="text-left px-6 py-4 font-semibold">Логин</th>
              <th className="text-left px-6 py-4 font-semibold">Группа</th>
              <th className="text-right px-6 py-4 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">{student.id}</td>
                <td className="px-6 py-4 font-medium">{student.user.fullName}</td>
                <td className="px-6 py-4">{student.user.login}</td>
                <td className="px-6 py-4">{student.group.name}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(student)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="p-10 text-center text-gray-500">Студенты не найдены</div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingStudent ? "Редактировать студента" : "Новый студент"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <input
                type="text"
                name="student-fullname"
                autoComplete="off"
                placeholder="ФИО *"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              />
              <input
                type="text"
                name="student-login"
                autoComplete="off"
                placeholder="Логин *"
                value={form.login}
                onChange={(e) => setForm({ ...form, login: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              />
              {!editingStudent && (
                <input
                  type="password"
                  name="student-password"
                  autoComplete="new-password"
                  placeholder="Пароль *"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  required
                />
              )}
              <select
                value={form.groupId}
                onChange={(e) => setForm({ ...form, groupId: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                required
              >
                <option value="">Выберите группу *</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
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
