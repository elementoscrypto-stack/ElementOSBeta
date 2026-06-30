import { useEffect, useState } from "react";

export function useWorkspace(key = "elementos-workspace", initialValue = {}) {
  const [workspace, setWorkspace] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) || initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(workspace));
  }, [key, workspace]);

  return [workspace, setWorkspace];
}
