import { Subject, Category } from "../types";

export function parsePastedClassProfile(text: string): Subject[] {
  const subjectsMap = new Map<string, Subject>();
  
  const getOrCreateSubject = (name: string): Subject => {
    let sub = subjectsMap.get(name.toLowerCase());
    if (!sub) {
      sub = {
        id: "sub_" + Math.random().toString(36).substr(2, 9),
        name,
        categories: []
      };
      subjectsMap.set(name.toLowerCase(), sub);
    }
    return sub;
  };

  const lines = text.split("\n");
  let currentMode: "midterm" | "final" | "both" = "both";
  let currentSubject: Subject | null = null;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const lowerLine = line.toLowerCase();
    
    // Check mode switches
    if (lowerLine.includes("mid-term") || lowerLine.includes("midterm")) {
      currentMode = "midterm";
      currentSubject = null;
      continue;
    }
    if (lowerLine.includes("final test") || lowerLine === "final" || lowerLine === "final:") {
      currentMode = "final";
      currentSubject = null;
      continue;
    }

    // Try to parse subjects and categories
    // Example 1: "Reading: Reading 70%, Dictation 30%"
    // Example 2: "Writing 100%"
    // Example 3: "Writing, Computer, Listening - 100%"
    
    // Remove "100%" if it's just the subject total
    let cleanLine = line.replace(/100%/g, '').trim();
    if (cleanLine.endsWith(':') || cleanLine.endsWith('-')) {
        cleanLine = cleanLine.substring(0, cleanLine.length - 1).trim();
    }

    // Check if line contains percentages other than 100%
    const categoryMatches = Array.from(line.matchAll(/([a-zA-Z\s]+?)\s*(\d+)%/g));
    
    if (categoryMatches.length > 0 && categoryMatches.some(m => m[2] !== '100')) {
        // This line contains categories with weights
        // E.g. "Reading 70%, Dictation 30%" or "Reading: Reading 70%, Dictation 30%"
        let subjectName = currentSubject ? currentSubject.name : "";
        
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0 && !currentSubject) {
             subjectName = line.substring(0, colonIndex).trim();
        } else if (!currentSubject) {
             // If no current subject, use the first category name or "Subject"
             subjectName = categoryMatches[0][1].trim() || "Subject";
        }
        
        const sub = getOrCreateSubject(subjectName);
        
        categoryMatches.forEach(m => {
            let catName = m[1].trim();
            if (catName.toLowerCase().startsWith('and ')) catName = catName.substring(4).trim();
            if (catName.endsWith(':') || catName.endsWith(',')) catName = catName.substring(0, catName.length - 1).trim();
            if (!catName) catName = "Score";
            
            const weight = parseInt(m[2], 10);
            
            // Check if category already exists
            let cat = sub.categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
            if (!cat) {
                cat = {
                    id: "cat_" + Math.random().toString(36).substr(2, 9),
                    name: catName,
                    weight: 0,
                    itemCount: 1,
                    itemMaxScores: [100]
                };
                sub.categories.push(cat);
            }
            if (currentMode === "midterm" || currentMode === "both") cat.midtermWeight = weight;
            if (currentMode === "final" || currentMode === "both") cat.finalWeight = weight;
        });
        
    } else {
        // It's just a subject or a list of subjects
        // "Writing, Computer, Listening"
        const subjectNames = cleanLine.split(/,|and/).map(s => s.trim()).filter(s => s.length > 0 && s.toLowerCase() !== 'all');
        subjectNames.forEach(name => {
             const sub = getOrCreateSubject(name);
             // By default, if a subject is just listed, it has one 100% category
             if (sub.categories.length === 0) {
                 const catName = "Score";
                 sub.categories.push({
                     id: "cat_" + Math.random().toString(36).substr(2, 9),
                     name: catName,
                     weight: 100, // Or 0 if it's purely midterm/final
                     itemCount: 1,
                     itemMaxScores: [100],
                     midtermWeight: currentMode === "midterm" || currentMode === "both" ? 100 : 0,
                     finalWeight: currentMode === "final" || currentMode === "both" ? 100 : 0,
                 });
             } else {
                 // Add 100% weight to existing category if applicable
                 const cat = sub.categories[0];
                 if (currentMode === "midterm") cat.midtermWeight = 100;
                 if (currentMode === "final") cat.finalWeight = 100;
             }
             currentSubject = sub;
        });
    }
  }
  
  return Array.from(subjectsMap.values());
}
