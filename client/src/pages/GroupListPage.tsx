import React, { useEffect, useState } from "react";
import { useGroups } from "../entities/group/group.store";
import { useCourses } from "../entities/course/course.store";
import { useNavigate } from "react-router-dom";

export default function GroupListPage() {
  const { 
    groups, availableStudents, isLoading, 
    fetchGroups, fetchAvailableStudents, 
    createNewGroup, addStudentToGroup, assignCourseToGroup 
  } = useGroups();
  
  const { courses, fetchCourses } = useCourses();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    fetchGroups();
    fetchAvailableStudents();
    fetchCourses(); 
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    await createNewGroup(groupName);
    setGroupName("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/")}>⬅ Back to Dashboard</button>
      <h1>👥 Student Groups Management</h1>

      {/* Форма создания группы */}
      <fieldset style={{ marginBottom: "20px", padding: "15px" }}>
        <legend>Create New Group</legend>
        <form onSubmit={handleCreateGroup} style={{ display: "flex", gap: "10px" }}>
          <input 
            placeholder="e.g., WEB-24" 
            value={groupName} 
            onChange={(e) => setGroupName(e.target.value)} 
            required 
          />
          <button type="submit">Create</button>
        </form>
      </fieldset>

      {/* Список групп */}
      {isLoading ? (
        <p>Loading groups...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {groups.map((group) => (
            <div key={group.id} style={{ border: "1px solid #777", padding: "15px", borderRadius: "8px" }}>
              <h2> Group: {group.name}</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "10px" }}>
                
                <div style={{ background: "#f9f9f9", padding: "10px", borderRadius: "6px" }}>
                  <h3> Students ({group.students?.length || 0})</h3>
                  <ul>
                    {group.students?.map(s => (
                      <li key={s.id}>
                      {s.fullName}
                       </li>
                      ))}
                  </ul>
                  
                
                  <select 
                    defaultValue="" 
                    onChange={(e) => {
                      if(e.target.value) addStudentToGroup(group.id, e.target.value);
                      e.target.value = "";
                    }}
                  >
                    <option value="" disabled>+ Add student to group</option>
                    {availableStudents.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                  </select>
                </div>

              
                <div style={{ background: "#f0f4f8", padding: "10px", borderRadius: "6px" }}>
                  <h3>📚 Active Courses ({group.courses?.length || 0})</h3>
                  <ul>
                    {group.courses?.map(c => <li key={c.id}><strong>{c.title}</strong></li>)}
                  </ul>

               
                  <select 
                    defaultValue="" 
                    onChange={(e) => {
                      if(e.target.value) assignCourseToGroup(group.id, e.target.value);
                      e.target.value = "";
                    }}
                  >
                    <option value="" disabled>+ Assign course to group</option>
                    {courses
                    
                      .filter(c => !group.courses?.some(gc => gc.id === c.id))
                      .map(c => <option key={c.id} value={c.id}>{c.title}</option>)
                    }
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
