"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";

interface SaveToListSheetProps {
  eventId: string;
  currentListName: string | null;
  onClose: () => void;
  onSaved: (listName: string) => void;
}

export default function SaveToListSheet({
  eventId,
  currentListName,
  onClose,
  onSaved,
}: SaveToListSheetProps) {
  const { getAllListNames, addSavedEvent, addCustomList } = useUser();
  const [newListName, setNewListName] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);

  const listNames = getAllListNames();

  const handleSelectList = (listName: string) => {
    addSavedEvent(eventId, listName);
    onSaved(listName);
    onClose();
  };

  const handleCreateList = () => {
    const trimmed = newListName.trim();
    if (!trimmed) return;
    addCustomList(trimmed);
    addSavedEvent(eventId, trimmed);
    onSaved(trimmed);
    onClose();
  };

  return (
    <div>
      <p
        className="sift-text-sm"
        style={{
          color: "hsl(var(--secondary))",
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        Save to list
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {listNames.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => handleSelectList(name)}
            className="sift-option"
            style={{
              textAlign: "left",
              padding: "0.75rem 1rem",
              border:
                currentListName === name
                  ? "2px solid hsl(var(--primary))"
                  : "1px solid hsl(var(--border))",
            }}
          >
            {name}
            {currentListName === name && " ✓"}
          </button>
        ))}
      </div>
      {showNewInput ? (
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List name"
            autoFocus
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius)",
              border: "1px solid hsl(var(--border))",
              fontSize: 16,
            }}
          />
          <button
            type="button"
            onClick={handleCreateList}
            className="sift-btn-primary"
            disabled={!newListName.trim()}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNewInput(true)}
          className="sift-btn-ghost"
          style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
        >
          Create new list
        </button>
      )}
    </div>
  );
}
