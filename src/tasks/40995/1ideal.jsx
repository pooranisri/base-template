import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [sleepEntries, setSleepEntries] = useState([]);
  const [goalDuration, setGoalDuration] = useState("");
  const [goalFeedback, setGoalFeedback] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sleepDuration, setSleepDuration] = useState("");

  const handleTabChange = (tab) => {
    if (tab === "addSleepEntry") {
      resetSleepEntryForm();
    }  else if (tab === "sleepGoals") {
      resetGoalForm();
    }else {
      resetGoalForm();
    }
    setActiveTab(tab);
  };

  const handleSleepEntrySubmit = () => {
    setErrorMessage("");

    if (!name) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setErrorMessage("Name must only contain letters.");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    if (selectedDate > today) {
      setErrorMessage("Date cannot be in the future.");
      return;
    }

    if (!date || !sleepTime || !wakeTime) {
      setErrorMessage("All fields are mandatory.");
      return;
    }

    if (sleepTime === wakeTime) {
      setErrorMessage("Sleep time and wake time cannot be the same.");
      return;
    }

    const duration = calculateDuration(sleepTime, wakeTime);
    setSleepEntries([...sleepEntries, { name, date, sleepTime, wakeTime, sleepDuration: duration.toFixed(2) }]);
    setSleepDuration(duration.toFixed(2));
    resetSleepEntryForm();
  };

  const calculateDuration = (sleep, wake) => {
    const sleepDate = new Date(`1970-01-01T${sleep}`);
    let wakeDate = new Date(`1970-01-01T${wake}`);

    if (wakeDate <= sleepDate) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }

    const duration = (wakeDate - sleepDate) / 1000 / 60 / 60;
    return Math.abs(duration);
  };

  const handleGoalSubmit = () => {
    const duration = parseInt(goalDuration, 10);

    if (isNaN(duration) || duration < 0) {
      setGoalFeedback("Please enter a valid positive duration.");
      return;
    }

    if (duration > 24) {
      setGoalFeedback("Duration cannot exceed 24 hours.");
      return;
    }

    if (duration >= 8) {
      setGoalFeedback("Good sleep duration!");
    } else if (duration >= 6) {
      setGoalFeedback("Moderate sleep duration, could be improved.");
    } else {
      setGoalFeedback("Immediate action must be taken! Use the tips provided to improve your sleep!!!");
    }
  };

  const resetSleepEntryForm = () => {
    setName("");
    setDate("");
    setSleepTime("");
    setWakeTime("");
    setSleepDuration("");
  };

  const resetGoalForm = () => {
    setGoalDuration("");
    setGoalFeedback("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Card className="w-full max-w-2xl mt-10 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-indigo-600">Sleep Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around mb-5">
            <TabButton isActive={activeTab === "addSleepEntry"} onClick={() => handleTabChange("addSleepEntry")}>
              Add Sleep Entry
            </TabButton>
            <TabButton isActive={activeTab === "sleepGoals"} onClick={() => handleTabChange("sleepGoals")}>
              Sleep Duration Check
            </TabButton>
            <TabButton isActive={activeTab === "usefulTips"} onClick={() => handleTabChange("usefulTips")}>
              Useful Tips
            </TabButton>
          </div>
          {activeTab === "addSleepEntry" && (
            <AddSleepEntry
              name={name}
              setName={setName}
              date={date}
              setDate={setDate}
              sleepTime={sleepTime}
              setSleepTime={setSleepTime}
              wakeTime={wakeTime}
              setWakeTime={setWakeTime}
              handleSubmit={handleSleepEntrySubmit}
              sleepEntries={sleepEntries}
              errorMessage={errorMessage}
              resetSleepEntryForm={resetSleepEntryForm}
              sleepDuration={sleepDuration}
            />
          )}
          {activeTab === "sleepGoals" && (
            <SleepGoals
              goalDuration={goalDuration}
              setGoalDuration={setGoalDuration}
              handleGoalSubmit={handleGoalSubmit}
              goalFeedback={goalFeedback}
              resetGoalForm={resetGoalForm}
            />
          )}
          {activeTab === "usefulTips" && <UsefulTips />}
        </CardContent>
      </Card>
    </div>
  );
}

const TabButton = ({ isActive, onClick, children }) => {
  return (
    <button
      className={`py-2 px-4 font-semibold transition-colors duration-300 ${isActive ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const AddSleepEntry = ({ name, setName, date, setDate, sleepTime, setSleepTime, wakeTime, setWakeTime, handleSubmit, sleepEntries, errorMessage, resetSleepEntryForm, sleepDuration }) => {
  return (
    <div className="flex flex-col space-y-4">
      <label className="font-medium text-indigo-600">Name:</label>
      <input className="border p-2 rounded-md shadow-sm" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
      
      <label className="font-medium text-indigo-600">Date:</label>
      <input className="border p-2 rounded-md shadow-sm" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      
      <label className="font-medium text-indigo-600">Sleep Time:</label>
      <input className="border p-2 rounded-md shadow-sm" type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} required />
      
      <label className="font-medium text-indigo-600">Wake Time:</label>
      <input className="border p-2 rounded-md shadow-sm" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} required />
      
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      
      <div className="flex space-x-2">
        <button className="bg-indigo-600 text-white py-1 px-2 rounded-md hover:bg-indigo-700 transition duration-200" onClick={handleSubmit}>Submit</button>
        <button className="bg-gray-300 py-1 px-2 rounded-md hover:bg-gray-400 transition duration-200" onClick={resetSleepEntryForm}>Reset</button>
      </div>
      
      {sleepDuration && (
        <p className="text-green-600 font-bold mt-4">Sleep Duration: {sleepDuration} hours</p>
      )}
      
      {sleepEntries.length > 0 && (
        <>
          <h3 className="font-bold mt-4 text-indigo-600">Sleep History:</h3>
          {sleepEntries.map((entry, index) => (
            <div key={index} className="border p-2 my-1 rounded-md shadow-sm bg-gray-100">
              <p className="text-dark-gray">Name: {entry.name}</p>
              <p className="text-dark-gray">Date: {entry.date}</p>
              <p className="text-dark-gray">Sleep Time: {entry.sleepTime}</p>
              <p className="text-dark-gray">Wake Time: {entry.wakeTime}</p>
              <p className="text-dark-gray">Duration: {entry.sleepDuration} hours</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

const SleepGoals = ({ goalDuration, setGoalDuration, handleGoalSubmit, goalFeedback, resetGoalForm }) => {
  return (
    <div className="flex flex-col space-y-4">
      <label className="font-medium text-indigo-600">Sleep Duration Check (hours):</label>
      <input className="border p-2 rounded-md shadow-sm" type="number" placeholder="Enter sleep duration in hours" value={goalDuration} onChange={(e) => setGoalDuration(e.target.value)} required />
      
      <div className="flex space-x-2">
        <button className="bg-indigo-600 text-white py-1 px-2 rounded-md hover:bg-indigo-700 transition duration-200" onClick={handleGoalSubmit}>Submit</button>
        <button className="bg-gray-300 py-1 px-2 rounded-md hover:bg-gray-400 transition duration-200" onClick={resetGoalForm}>Reset</button>
      </div>
      
      {goalFeedback && <p className="text-red-600">{goalFeedback}</p>}
    </div>
  );
};

const UsefulTips = () => {
  const tips = [
    "Maintain a regular sleep schedule.",
    "Create a bedtime routine.",
    "Limit screen time before bed.",
    "Keep your bedroom cool and dark.",
    "Avoid large meals and caffeine before sleeping.",
    "Exercise regularly but not before bedtime.",
    "Manage stress through relaxation techniques.",
    "Limit naps during the day.",
    "Use comfortable bedding.",
    "Consider a sleep mask or white noise machine."
  ];

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-bold text-indigo-600">Useful Tips:</h3>
      <ul className="list-disc list-inside">
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};
