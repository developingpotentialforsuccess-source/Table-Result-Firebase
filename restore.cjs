const fs = require('fs');
let content = fs.readFileSync('src/components/GradeTable.tsx', 'utf8');

// I need to replace the broken part with the correct code.
// The broken part:
const broken = `                    </div>
                    
                    </div>
                    )}
                  </div>
                </th>`;

const fixed = `                    </div>
                    {!sc.isHidden && resultMode !== 'full' && settings?.showItemConfig !== false && (
                      <div className="flex items-center text-[9px] normal-case font-bold text-red-600 bg-red-50/50 px-1 py-0.5 rounded border border-red-200/50 mt-1">
                        <div className="flex items-center mt-0.5">
                          <span className="mr-0.5 opacity-70 uppercase text-[8px] tracking-tighter">MAX:</span>
                          <input
                            type="number"
                            min="1"
                            value={resultMode === 'midterm' ? (sc.subject.midtermMaxScore ?? '') : (sc.subject.finalMaxScore ?? '')}
                            onChange={(e) => {
                              if (!onUpdateLevel) return;
                              const newVal = e.target.value === '' ? undefined : Number(e.target.value);
                              const newSubjects = level.subjects.map(s => {
                                if (s.id !== sc.subject.id) return s;
                                return resultMode === 'midterm' 
                                  ? { ...s, midtermMaxScore: newVal }
                                  : { ...s, finalMaxScore: newVal };
                              });
                              onUpdateLevel({ ...level, subjects: newSubjects });
                            }}
                            className="w-8 no-spinners bg-transparent border-b border-red-300 focus:border-red-500 outline-none text-center font-bold text-red-700 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </th>`;

content = content.replace(broken, fixed);
fs.writeFileSync('src/components/GradeTable.tsx', content);
console.log("Restored");
