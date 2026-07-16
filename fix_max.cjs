const fs = require('fs');
let content = fs.readFileSync('src/components/GradeTable.tsx', 'utf8');

const targetStr = `                      </button>
                    </div>
                  </div>
                </th>`;

const newStr = `                      </button>
                    </div>
                    {settings?.showItemConfig !== false && resultMode !== 'full' && (
                        <div className="flex items-center justify-center mt-1">
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
                            className="w-8 no-spinners bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none text-center font-bold text-slate-700 text-xs"
                          />
                        </div>
                    )}
                  </div>
                </th>`;

content = content.replace(targetStr, newStr);
fs.writeFileSync('src/components/GradeTable.tsx', content);
console.log("Restored MAX input");
