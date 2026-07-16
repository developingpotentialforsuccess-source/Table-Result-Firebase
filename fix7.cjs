const fs = require('fs');
let content = fs.readFileSync('src/components/GradeTable.tsx', 'utf8');

const oldStr = `                      </button>
                    </div>
                                          </div>
                    )}
                  </div>
                </th>`;

const newStr = `                      </button>
                    </div>
                  </div>
                </th>`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('src/components/GradeTable.tsx', content);
