// App.jsx
import React from 'react';
import Tabs from './Tabs';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Sleep Tracker</h1>
      <Tabs />
    </div>
  );
}

// Tabs.jsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddSleepEntry from "./AddSleepEntry";
import SleepDurationCheck from "./SleepDurationCheck";
import UsefulTips from "./UsefulTips";

function TabsComponent() {
  const [value, setValue] = useState("add");

  return (
    <Tabs value={value} onValueChange={setValue} className="w-full max-w-md mx-auto">
      <TabsList>
        <TabsTrigger value="add">Add Entry</TabsTrigger>
        <TabsTrigger value="check">Check Duration</TabsTrigger>
        <TabsTrigger value="tips">Useful Tips</TabsTrigger>
      </TabsList>
      <TabsContent value="add"><AddSleepEntry /></TabsContent>
      <TabsContent value="check"><SleepDurationCheck /></TabsContent>
      <TabsContent value="tips"><UsefulTips /></TabsContent>
    </Tabs>
  );
}

export default TabsComponent;

// AddSleepEntry.jsx
import { useState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { format } from 'date-fns';

function AddSleepEntry() {
  const [entry, setEntry] = useState({ name: '', date: '', sleepTime: '', wakeTime: '' });
  const [history, setHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const duration = calculateDuration(entry.sleepTime, entry.wakeTime);
    setHistory([...history, { ...entry, duration }]);
    setEntry({ name: '', date: '', sleepTime: '', wakeTime: '' });
  };

  const calculateDuration = (start, end) => {
    const diff = (new Date(`1970-01-01T${end}`) - new Date(`1970-01-01T${start}`)) / (1000 * 60 * 60);
    return diff.toFixed(2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input fields for name, date, sleep and wake times */}
      <Button type="submit">Submit</Button>
      <Button type="button" onClick={() => setEntry({ name: '', date: '', sleepTime: '', wakeTime: '' })} variant="secondary">Reset</Button>
      {/* History Display */}
    </form>
  );
}

// SleepDurationCheck.jsx
function SleepDurationCheck() {
  // Similar structure for checking sleep duration
}

// UsefulTips.jsx
function UsefulTips() {
  const tips = [
    "Maintain a regular sleep schedule.", /* Add more tips here */
  ];

  return (
    <ul className="list-disc pl-5">
      {tips.map((tip, index) => <li key={index}>{tip}</li>)}
    </ul>
  );
}
