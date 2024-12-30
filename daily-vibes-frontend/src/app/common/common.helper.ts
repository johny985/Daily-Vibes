export function fetchLocalDiaryOnDate(date: string) {
  const storedEntries = localStorage.getItem("diaryEntries");
  const existingEntries = storedEntries ? JSON.parse(storedEntries) : [];

  const existingIndex = existingEntries.findIndex(
    (entry: any) => entry.contentDate === date
  );
  return existingEntries[existingIndex];
}

export async function saveLocalDiaryEntry(entry: any) {
  const token = localStorage.getItem("access_token");
  debugger;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/diary/vibe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: entry.content }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch vibe");
  }

  const { vibe } = await response.json();
  entry.vibe = vibe;
  console.log(vibe);

  const storageKey = "diaryEntries";
  const storedEntries = localStorage.getItem(storageKey);
  const existingEntries = storedEntries ? JSON.parse(storedEntries) : [];

  const existingIndex = existingEntries.findIndex(
    (existingEntry: any) => existingEntry.contentDate === entry.contentDate
  );

  if (existingIndex !== -1) {
    existingEntries[existingIndex] = entry;
  } else {
    existingEntries.push(entry);
  }

  localStorage.setItem(storageKey, JSON.stringify(existingEntries));

  return vibe;
}

export function deleteLocalDiaryEntry(date: string) {
  const storageKey = "diaryEntries";
  const storedEntries = localStorage.getItem(storageKey);
  const existingEntries = storedEntries ? JSON.parse(storedEntries) : [];

  const updatedEntries = existingEntries.filter(
    (entry: any) => entry.contentDate !== date
  );

  localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
}
