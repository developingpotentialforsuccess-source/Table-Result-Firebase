const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  const handleDownloadFullBackup = async (timeframe: string = "all") => {
    if (!user) return;
    
    const confirmBackup = confirm("This will gather ALL class records, students, and level settings into one file for safe backup. Proceed?");
    if (!confirmBackup) return;

    try {
      const backupData: any = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        userId: user.uid,
        userEmail: user.email || "local",
        levels: [],
        classRecords: [],
        students: {} // recordId -> Student[]
      };

      // 1. Fetch Levels
      backupData.levels = levels;

      // 2. Fetch Class Records
      backupData.classRecords = classRecords;

      // 3. Fetch Students for each class
      const fetchPromises = classRecords.map(async (record) => {`;

const newStr = `  const handleDownloadFullBackup = async (timeframe: string = "all") => {
    if (!user) return;
    
    const confirmBackup = confirm(\`This will gather \${timeframe === 'all' ? 'ALL' : 'the recent'} class records, students, and level settings into one file for safe backup. Proceed?\`);
    if (!confirmBackup) return;

    try {
      const backupData: any = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        userId: user.uid,
        userEmail: user.email || "local",
        levels: [],
        classRecords: [],
        students: {} // recordId -> Student[]
      };

      // 1. Fetch Levels
      backupData.levels = levels;

      // 2. Fetch Class Records
      let filteredRecords = classRecords;
      if (timeframe !== 'all') {
        const now = Date.now();
        const limits: Record<string, number> = {
          '1d': 24 * 60 * 60 * 1000,
          '3d': 3 * 24 * 60 * 60 * 1000,
          '1w': 7 * 24 * 60 * 60 * 1000,
          '1m': 30 * 24 * 60 * 60 * 1000,
          '3m': 90 * 24 * 60 * 60 * 1000,
          '6m': 180 * 24 * 60 * 60 * 1000,
        };
        const limit = limits[timeframe] || 0;
        
        filteredRecords = classRecords.filter(r => {
           const time = new Date(r.updatedAt || r.createdAt || Date.now()).getTime();
           return (now - time) <= limit;
        });
      }
      backupData.classRecords = filteredRecords;

      // 3. Fetch Students for each class
      const fetchPromises = filteredRecords.map(async (record) => {`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Fixed handleDownloadFullBackup filter");
} else {
  console.log("handleDownloadFullBackup filter not found");
}
