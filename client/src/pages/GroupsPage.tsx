import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import { getGroupsRequest } from "../api/groups";

type GroupType = {
  id: number;
  name: string;
};

export default function GroupsPage() {
  const [groups, setGroups] =
    useState<GroupType[]>([]);

  const loadGroups = async () => {
    try {
      const data =
        await getGroupsRequest();

      setGroups(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <MainLayout>
      <h1>Groups</h1>

      <div>
        {groups.map((group) => (
          <div key={group.id}>
            {group.name}
          </div>
        ))}
      </div>
    </MainLayout>
  );
}