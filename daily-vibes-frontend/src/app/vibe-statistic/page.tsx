"use client";

import { useState, useEffect, Suspense, ChangeEvent } from "react";
import useFetchDiary from "../hooks/useFetchDiary";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import CalendarSkeleton from "../skeleton/calendarSkeleton";

interface ChartData {
  name: string;
  vibe: string;
  count: number;
}

const vibeDetails: Record<string, { label: string; color: string }> = {
  Happy: { label: "😊 Happy", color: "#FFD700" },
  Sad: { label: "😢 Sad", color: "#1E90FF" },
  Exhausted: { label: "😩 Exhausted", color: "#A9A9A9" },
  Angry: { label: "😡 Angry", color: "#FF4500" },
};

export default function Page() {
  const { dailyData, fetchDiaryContent, isLoading } = useFetchDiary();

  const [date, setDate] = useState<string>(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    return `${currentYear}-${currentMonth}`;
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (dailyData && dailyData.length > 0) {
      const vibeCounts = dailyData.reduce((acc: any, entry: any) => {
        const vibe = entry.vibe;
        acc[vibe] = (acc[vibe] || 0) + 1;
        return acc;
      }, {});

      const formattedData = Object.keys(vibeCounts).map((vibe) => ({
        name: vibeDetails[vibe]?.label || vibe,
        vibe: vibe,
        count: vibeCounts[vibe],
      }));

      setChartData(formattedData);
    } else {
      setChartData([]);
    }
  }, [dailyData]);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [year, month] = e.target.value.split("-");
    fetchDiaryContent(parseInt(year, 10), parseInt(month, 10));
    setDate(e.target.value);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Diary Entries</h1>
      <p>
        <label>
          Date:
          <input
            type="month"
            value={date}
            onChange={handleDateChange}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </p>

      {isLoading && <CalendarSkeleton />}

      {!isLoading && dailyData.length === 0 && (
        <p>No diary entries found for the selected month.</p>
      )}

      {!isLoading && dailyData.length > 0 && (
        <>
          <div
            style={{
              width: "100%",
              height: "400px",
              marginTop: "40px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Vibe Count">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={vibeDetails[entry.vibe]?.color || "#8884d8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
