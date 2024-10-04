import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  const [activeTab, setActiveTab] = useState('add');
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    sleepTime: '',
    wakeTime: ''
  });
  const [sleepDuration, setSleepDuration] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDuration = (sleep, wake) => {
    const sleepTime = new Date(`1970-01-01T${sleep}:00`);
    const wakeTime = new Date(`1970-01-01T${wake}:00`);
    let diff = (wakeTime - sleepTime) / 1000 / 60 / 60; // hours
    return diff > 0 ? diff : diff + 24; // handle crossing midnight
  };

  const submitEntry = () => {
    if (!formData.name || !formData.date || !formData.sleepTime || !formData.wakeTime) {
      alert('Please fill all fields.');
      return;
    }
    const duration = calculateDuration(formData.sleepTime, formData.wakeTime);
    setEntries(prevEntries => [...prevEntries, { ...formData, duration }]);
    setFormData({ name: '', date: '', sleepTime: '', wakeTime: '' });
  };

  const checkSleepDuration = (hours) => {
    if (hours >= 8) return 'Good';
    if (hours > 6) return 'Moderate';
    return 'Needs Improvement';
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Sleep Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="add">Add Sleep Entry</TabsTrigger>
              <TabsTrigger value="check">Sleep Duration Check</TabsTrigger>
              <TabsTrigger value="tips">Useful Tips</TabsTrigger>
            </TabsList>
            <TabsContent value="add">
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" name="date" value={formData.date} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="sleepTime">Sleep Time</Label>
                  <Input id="sleepTime" type="time" name="sleepTime" value={formData.sleepTime} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="wakeTime">Wake Up Time</Label>
                  <Input id="wakeTime" type="time" name="wakeTime" value={formData.wakeTime} onChange={handleInputChange} />
                </div>
                <Button onClick={submitEntry}>Submit</Button>
                <Button onClick={() => setFormData({ name: '', date: '', sleepTime: '', wakeTime: '' })} className="ml-2">Reset</Button>
              </form>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Sleep History</h3>
                {entries.map((entry, idx) => (
                  <div key={idx} className="mt-2 border p-2 rounded">
                    <p>{entry.name} - {entry.date}</p>
                    <p>Sleep: {entry.sleepTime}, Wake: {entry.wakeTime}, Duration: {entry.duration.toFixed(2)} hours</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="check">
              <div className="space-y-4">
                <Input 
                  type="number" 
                  value={sleepDuration} 
                  onChange={(e) => setSleepDuration(e.target.value)} 
                  placeholder="Enter sleep duration in hours"
                />
                <Button onClick={() => checkSleepDuration(sleepDuration)}>Check</Button>
                <Button onClick={() => setSleepDuration(null)} className="ml-2">Reset</Button>
                {sleepDuration && <p>Sleep Quality: {checkSleepDuration(sleepDuration)}</p>}
              </div>
            </TabsContent>
            <TabsContent value="tips">
              <ul className="list-disc pl-5">
                <li>Maintain a regular sleep schedule.</li>
                <li>Create a restful sleeping environment.</li>
                <li>Limit exposure to light before bedtime.</li>
                <li>Avoid caffeine and nicotine.</li>
                <li>Exercise regularly but not too close to bedtime.</li>
                <li>Don't eat heavy meals late in the day.</li>
                <li>Practice a relaxing bedtime ritual.</li>
                <li>Limit daytime naps.</li>
                <li>Get natural light exposure during the day.</li>
                <li>Manage worries or stress before bedtime.</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;