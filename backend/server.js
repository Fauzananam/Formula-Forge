import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(__dirname));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    formula: 'Error: Server error',
    explanation: 'An unexpected error occurred. Please try again.'
  });
});

// Indonesian to English keyword mappings
const idToEn = {
  'jumlahkan': 'sum',
  'rata-rata': 'average',
  'hitung': 'count',
  'cari': 'lookup',
  'horizontal': 'horizontal',
  'indeks': 'index',
  'cocok': 'match',
  'jika': 'if',
  'dan': 'and',
  'di mana': 'where',
  'kolom': 'column',
  'sel': 'cell',
  'tabel': 'table',
  'kembali': 'return',
  'adalah': 'is',
  'sama dengan': 'equals',
  'lebih besar dari': 'is greater than',
  'lebih kecil dari': 'is less than',
  'lebih besar atau sama dengan': 'is greater than or equal to',
  'lebih kecil atau sama dengan': 'is less than or equal to',
  'tidak sama dengan': 'is not',
  'nilai': 'value',
  'dari': 'from',
  'ke': 'to',
  'ke-': 'th'
};

// Operator mappings for conditions
const operatorMappings = {
  'is': '=',
  'equals': '=',
  'is greater than': '>',
  'is less than': '<',
  'is greater than or equal to': '>=',
  'is less than or equal to': '<=',
  'is not': '<>',
  'contains': 'LIKE',
  'starts with': 'BEGINS',
  'ends with': 'ENDS',
  'matches': 'EXACT'
};

// Excel function patterns
const excelPatterns = {
  vlookup: /(?:find|lookup|search for|get) (?:value|data|item) (?:from|in) (?:column )?(\w+)(?: where| with| having)? (?:column )?(\w+)(?: equals| is| matches) ([\w\d]+)(?: and return| returning| from| in) (?:column )?(\w+)/i,
  hlookup: /horizontal (?:find|lookup|search for|get) (?:value|data|item) (?:from|in) (?:row )?(\w+)(?: where| with| having)? (?:row )?(\w+)(?: equals| is| matches) ([\w\d]+)(?: and return| returning| from| in) (?:row )?(\w+)/i,
  index_match: /(?:find|get|lookup|search for) (?:value|data|item) (?:from|in) (?:column )?(\w+)(?: where| with| having)? (?:column )?(\w+)(?: equals| is| matches) ([\w\d]+)/i,
  concatenate: /(?:combine|concatenate|join|merge)(?: text| values)?(?: from)?(?: columns?)? ((?:\w+(?:,\s*|\s+and\s+))*\w+)/i,
  if: /if (?:column )?(\w+)(?: is| equals) ([\w\d]+) then ([\w\d]+)(?: else| otherwise) ([\w\d]+)/i,
  nested_if: /if (?:column )?(\w+)(?: is| equals) ([\w\d]+) then ([\w\d]+)(?: else if (?:column )?(\w+)(?: is| equals) ([\w\d]+) then ([\w\d]+))*(?: else| otherwise) ([\w\d]+)/i,
  sumifs: /sum (?:values|numbers) (?:from|in) (?:column )?(\w+)(?: where| with| having) multiple conditions/i,
  countifs: /count (?:values|numbers|cells) (?:where|with|having) multiple conditions/i,
  averageifs: /average (?:values|numbers) (?:from|in) (?:column )?(\w+)(?: where| with| having) multiple conditions/i,
  round: /round(?: the)?(?: value| number)?(?: in)?(?: column)? (\w+)(?: to) (\d+)(?: decimal| decimals| decimal places| decimal point)/i,
  roundup: /round(?: the)?(?: value| number)?(?: in)?(?: column)? (\w+)(?: up)(?: to) (\d+)(?: decimal| decimals| decimal places| decimal point)/i,
  rounddown: /round(?: the)?(?: value| number)?(?: in)?(?: column)? (\w+)(?: down)(?: to) (\d+)(?: decimal| decimals| decimal places| decimal point)/i,
  len: /(?:get |find |calculate )?(?:the )?length of(?: text| string| value)(?: in)?(?: column)? (\w+)/i,
  left: /get(?: the)? first (\d+) characters?(?: from)(?: column)? (\w+)/i,
  right: /get(?: the)? last (\d+) characters?(?: from)(?: column)? (\w+)/i,
  mid: /get(?: the)? (\d+) characters? starting (?:from|at) position (\d+)(?: from)(?: column)? (\w+)/i,
  substitute: /replace(?: all)?(?: occurrences of)? ([\w\s]+)(?: with| by) ([\w\s]+)(?: in)(?: column)? (\w+)/i,
  trim: /(?:remove|trim)(?: all)? spaces(?: from)(?: column)? (\w+)/i,
  proper: /capitalize(?: each)?(?: word)(?: in)(?: column)? (\w+)/i,
  upper: /convert(?: to)? uppercase(?: in)(?: column)? (\w+)/i,
  lower: /convert(?: to)? lowercase(?: in)(?: column)? (\w+)/i
};

app.post('/generate-formula', async (req, res) => {
  try {
    if (!req.body || !req.body.query || typeof req.body.query !== 'string') {
      return res.status(400).json({
        formula: 'Error: Invalid query',
        explanation: 'Please provide a valid text query to generate a formula.'
      });
    }

    let query = req.body.query.toLowerCase().trim();
    
    // Basic query validation
    if (query.length < 3) {
      return res.status(400).json({
        formula: 'Error: Query too short',
        explanation: 'Please provide a more detailed query. Example: "Sum values in column A where column B is Yes"'
      });
    }

    // Extract column references - allow for both natural language and direct formula patterns
    const columnRefs = query.match(/(?:column|kolom) [A-Za-z]/gi) || 
                       query.match(/[A-Za-z]:[A-Za-z]/g) || 
                       query.match(/=[A-Z]+\(/gi);
                     
    if (columnRefs.length < 1) {
      return res.status(400).json({
        formula: 'Error: No column references found',
        explanation: 'Please specify at least one column using "column X" format, where X is a letter, or use direct Excel references like "A:A". Examples: "Sum values in column A where column B is Yes" or "Jumlahkan nilai di kolom A di mana kolom B adalah Ya"'
      });
    }
  
    // Check for direct formula pattern
    const directFormulaMatch = query.match(/^=([A-Z]+)\(([^)]+)\)$/i);
    if (directFormulaMatch) {
      const formulaFunction = directFormulaMatch[1].toUpperCase();
      const params = directFormulaMatch[2].split(',').map(p => p.trim());
    
      formula = `=${formulaFunction}(${params.join(', ')})`;
      explanation = `This is a direct ${formulaFunction} formula with the specified parameters.`;
    
      return res.json({ formula, explanation });
    }

    // Replace Indonesian keywords with English
    for (const [idWord, enWord] of Object.entries(idToEn)) {
      query = query.replace(new RegExp(idWord, 'gi'), enWord);
    }

    let formula = '';
    let explanation = '';

    // Advanced function detection
    let matched = false;
    
    // Try matching against each Excel pattern
    for (const [funcType, pattern] of Object.entries(excelPatterns)) {
      const match = query.match(pattern);
      if (match) {
        matched = true;
        switch(funcType) {
          case 'vlookup':
            const [_v1, vlookupCol, vlookupCondCol, vlookupValue, vlookupReturnCol] = match;
            formula = `=VLOOKUP(${vlookupCondCol}:${vlookupCondCol}, ${vlookupCol}:${vlookupReturnCol}, ${getColumnDistance(vlookupCol, vlookupReturnCol)}, FALSE)`;
            explanation = `This formula looks up values in column ${vlookupCondCol} that match ${vlookupValue} and returns the corresponding values from column ${vlookupReturnCol}.`;
            break;
            
          case 'hlookup':
            const [_v2, hLookupRow, hLookupCondRow, hLookupValue, hLookupReturnRow] = match;
            formula = `=HLOOKUP(${hLookupCondRow}:${hLookupCondRow}, ${hLookupRow}:${hLookupReturnRow}, ${getRowDistance(hLookupRow, hLookupReturnRow)}, FALSE)`;
            explanation = `This formula looks up values in row ${hLookupCondRow} that match ${hLookupValue} and returns the corresponding values from row ${hLookupReturnRow}.`;
            break;
            
          case 'index_match':
            const [_v3, imReturnCol, imMatchCol, imMatchValue] = match;
            formula = `=INDEX(${imReturnCol}:${imReturnCol}, MATCH(${imMatchValue}, ${imMatchCol}:${imMatchCol}, 0))`;
            explanation = `This formula finds ${imMatchValue} in column ${imMatchCol} and returns the corresponding value from column ${imReturnCol}.`;
            break;
            
          case 'concatenate':
            const columns = match[1].split(/,\s*|\s+and\s+/).map(col => `${col}:${col}`);
            formula = `=CONCATENATE(${columns.join(', ')})`;
            explanation = `This formula combines text from columns ${columns.map(col => col.split(':')[0]).join(', ')}.`;
            break;
            
          case 'if':
            const [_v4, ifCondCol, ifCondValue, ifTrueValue, ifFalseValue] = match;
            formula = `=IF(${ifCondCol}:${ifCondCol}="${ifCondValue}", "${ifTrueValue}", "${ifFalseValue}")`;
            explanation = `This formula returns "${ifTrueValue}" if the value in column ${ifCondCol} equals ${ifCondValue}, otherwise returns "${ifFalseValue}".`;
            break;
            
          case 'nested_if':
            let parts = match.slice(1).filter(Boolean);
            let nestedFormula = buildNestedIf(parts);
            formula = nestedFormula;
            explanation = `This formula performs multiple conditional checks and returns different values based on the conditions.`;
            break;
            
          case 'roundup':
          case 'rounddown':
          case 'round':
            const [_v5, roundCol, roundDecimals] = match;
            const roundFunc = funcType.toUpperCase();
            formula = `=${roundFunc}(${roundCol}:${roundCol}, ${roundDecimals})`;
            explanation = `This formula rounds the values in column ${roundCol} to ${roundDecimals} decimal places using ${roundFunc}.`;
            break;
            
          case 'len':
          case 'trim':
          case 'proper':
          case 'upper':
          case 'lower':
            const [_v6, targetCol] = match;
            formula = `=${funcType.toUpperCase()}(${targetCol}:${targetCol})`;
            explanation = `This formula applies the ${funcType.toUpperCase()} function to values in column ${targetCol}.`;
            break;
            
          case 'left':
          case 'right':
            const [_v7, textChars, textSourceCol] = match;
            formula = `=${funcType.toUpperCase()}(${textSourceCol}:${textSourceCol}, ${textChars})`;
            explanation = `This formula extracts ${textChars} characters from the ${funcType} of the text in column ${textSourceCol}.`;
            break;
            
          case 'mid':
            const [_v8, midLength, midStart, midSourceCol] = match;
            formula = `=MID(${midSourceCol}:${midSourceCol}, ${midStart}, ${midLength})`;
            explanation = `This formula extracts ${midLength} characters starting at position ${midStart} from column ${midSourceCol}.`;
            break;
            
          case 'substitute':
            const [_v9, substOldText, substNewText, substSourceCol] = match;
            formula = `=SUBSTITUTE(${substSourceCol}:${substSourceCol}, "${substOldText}", "${substNewText}")`;
            explanation = `This formula replaces all occurrences of "${substOldText}" with "${substNewText}" in column ${substSourceCol}.`;
            break;
        }
        break;
      }
    }
    
    if (!matched) {
      // Handle original basic functions (SUMIF, AVERAGEIF, COUNTIF)
      if (query.includes('and')) {
        // Handle AND
        const andMatch = query.match(/if column (\w) equals (\w+) and column (\w) equals (\w+)/);
        if (andMatch) {
          const col1 = andMatch[1].toUpperCase();
          const val1 = andMatch[2];
          const col2 = andMatch[3].toUpperCase();
          const val2 = andMatch[4];
          formula = `=AND(${col1}:${col1}="${val1}", ${col2}:${col2}="${val2}")`;
          explanation = `This formula checks if column ${col1} equals ${val1} and column ${col2} equals ${val2}, returning TRUE or FALSE.`;
        }
      } else {
        // Handle SUMIF, AVERAGEIF, COUNTIF, SUMIFS, AVERAGEIFS, COUNTIFS
        const functionMatch = query.match(/\b(sum|average|count)\b/i);
        if (!functionMatch) {
          return res.status(400).json({
            formula: 'Error: Invalid function',
            explanation: 'Please start your query with one of these functions: SUM, AVERAGE, COUNT.\n\nExample queries:\n- "Sum values in column A where column B is Yes"\n- "Average of column C where column D is greater than 100"\n- "Count cells in column E where column F equals Active"'
          });
        }
        const functionKeyword = functionMatch[0];
        const isMultiCondition = query.includes('and') || query.split('where').length > 2;

        const whereIndex = query.indexOf('where');
        if (whereIndex === -1) {
          return res.status(400).json({
            formula: 'Error: Missing condition',
            explanation: 'Please include conditions using "where" in your query.\n\nExample: "Sum values in column A where column B is Yes"'
          });
        }

        const beforeWhere = query.substring(0, whereIndex).trim();
        const afterWhere = query.substring(whereIndex + 5).trim();

        // Validate condition format
        if (!afterWhere.match(/column [A-Za-z].*?(?:is|equals|>|<|>=|<=)/i)) {
          return res.status(400).json({
            formula: 'Error: Invalid condition format',
            explanation: 'Please use "column X is Y" or "column X equals Y" format.\n\nExample: "Sum values in column A where column B is Yes"'
          });
        }

        let sumColumn, criteriaColumns = [], operators = [], values = [];

        // Extract target column for aggregation
        if (functionKeyword !== 'count') {
          const targetColMatch = beforeWhere.match(/column (\w)/i);
          if (targetColMatch) {
            sumColumn = targetColMatch[1].toUpperCase();
          }
        }

        // Extract criteria columns
        const criteriaMatches = afterWhere.match(/column (\w)/gi);
        if (criteriaMatches) {
          criteriaColumns = criteriaMatches.map(match => match.split(' ')[1].toUpperCase());
        }

        if (functionKeyword !== 'count' && !sumColumn) {
          return res.status(400).json({
            formula: 'Error: Missing target column',
            explanation: 'Please specify which column to ' + functionKeyword + '.\n\nExample: "' + functionKeyword + ' values in column A where column B is Yes"'
          });
        }

        // Parse conditions
        const conditions = afterWhere.split(' and ');
        for (let cond of conditions) {
          const parts = cond.trim().split(/\s+/);
          let columnFound = false;
          let columnIndex = -1;
          
          // Find the column reference
          for (let i = 0; i < parts.length - 1; i++) {
            if (parts[i] === 'column' && /^[A-Za-z]$/i.test(parts[i + 1])) {
              columnFound = true;
              columnIndex = i + 2; // Start looking for operator after column letter
              break;
            }
          }

          if (!columnFound) continue;

          // Find operator and value
          let operatorPhrase = '';
          let value = '';
          
          for (let i = columnIndex; i < parts.length; i++) {
            const possibleOp = parts.slice(columnIndex, i + 1).join(' ');
            if (operatorMappings[possibleOp]) {
              operatorPhrase = possibleOp;
              value = parts.slice(i + 1).join(' ');
              break;
            }
          }

          if (operatorPhrase && value) {
            operators.push(operatorMappings[operatorPhrase]);
            values.push(value.replace(/["']/g, '').trim());
          }
        }

        if (criteriaColumns.length === 0 || operators.length === 0) {
          return res.status(400).json({
            formula: 'Error: Invalid criteria',
            explanation: 'Please specify columns and conditions clearly.\n\nExample formats:\n- "Sum values in column A where column B is Yes"\n- "Average of column C where column D > 100"\n- "Count cells in column E where column F equals Active"'
          });
        }

        // Generate formula
        let excelFunction;
        if (functionKeyword === 'sum') {
          excelFunction = isMultiCondition ? 'SUMIFS' : 'SUMIF';
        } else if (functionKeyword === 'average') {
          excelFunction = isMultiCondition ? 'AVERAGEIFS' : 'AVERAGEIF';
        } else if (functionKeyword === 'count') {
          excelFunction = isMultiCondition ? 'COUNTIFS' : 'COUNTIF';
        }

        if (excelFunction.endsWith('IF')) {
          const criteria = operators[0] === '=' ? `"${values[0]}"` : operators[0] + values[0];
          formula = excelFunction === 'COUNTIF'
            ? `=${excelFunction}(${criteriaColumns[0]}:${criteriaColumns[0]}, ${criteria})`
            : `=${excelFunction}(${criteriaColumns[0]}:${criteriaColumns[0]}, ${criteria}, ${sumColumn}:${sumColumn})`;
          explanation = excelFunction === 'COUNTIF'
            ? `This formula counts cells in column ${criteriaColumns[0]} where the value ${operators[0] === '=' ? 'equals' : operators[0]} ${values[0]}.`
            : `This formula ${functionKeyword}s values in column ${sumColumn} where column ${criteriaColumns[0]} ${operators[0] === '=' ? 'equals' : operators[0]} ${values[0]}.`;
        } else {
          let formulaParts = [sumColumn + ':' + sumColumn];
          for (let i = 0; i < criteriaColumns.length; i++) {
            const criteria = operators[i] === '=' ? `"${values[i]}"` : operators[i] + values[i];
            formulaParts.push(`${criteriaColumns[i]}:${criteriaColumns[i]}, ${criteria}`);
          }
          formula = `=${excelFunction}(${formulaParts.join(', ')})`;
          explanation = `This formula ${functionKeyword}s values in column ${sumColumn} where the following conditions are met: ${criteriaColumns.map((col, i) => `column ${col} ${operators[i] === '=' ? 'equals' : operators[i]} ${values[i]}`).join(' and ')}.`;
        }
      }
    }

    if (!formula) {
      return res.status(400).json({
        formula: 'Error: Unable to parse query',
        explanation: 'Please check your query format and try again.\n\nExample queries:\n1. "Sum values in column A where column B is Yes"\n2. "Average of column C where column D > 100"\n3. "Count cells in column E where column F equals Active"\n4. "Look up value in cell A1 in table from B1 to D10 and return from 2nd column"\n5. "=CONCATENATE(A:A, B:B, C:C)"\n6. "Jumlahkan nilai di kolom A di mana kolom B adalah Ya"'
      });
    }

    res.json({ formula, explanation });
  } catch (error) {
    console.error('Error processing query:', error);
    const status = error.status || 500;
    const message = error.message || 'An error occurred while processing your query.';
    
    res.status(status).json({
      formula: `Error: ${status === 500 ? 'Server error' : 'Invalid query'}`,
      explanation: `${message}\n\nExample queries:\n- "Sum values in column A where column B is Yes"\n- "Average of column C where column D > 100"\n- "Count cells in column E where column F equals Active"\n- "=VLOOKUP(B:B, A:C, 3, FALSE)"\n- "Jumlahkan nilai di kolom A di mana kolom B adalah Ya"`
    });
  }
});

// Helper functions for Excel formulas
function getColumnDistance(startCol, endCol) {
  const start = startCol.toUpperCase().charCodeAt(0) - 64;
  const end = endCol.toUpperCase().charCodeAt(0) - 64;
  return Math.abs(end - start) + 1;
}

function getRowDistance(startRow, endRow) {
  return Math.abs(parseInt(endRow) - parseInt(startRow)) + 1;
}

function buildNestedIf(parts) {
  let formula = '=IF(';
  for (let i = 0; i < parts.length; i += 3) {
    if (i === 0) {
      // First condition
      formula += `${parts[i]}:${parts[i]}="${parts[i+1]}", "${parts[i+2]}"`;
    } else if (i === parts.length - 1) {
      // Last else value
      formula += `, "${parts[i]}"`;
    } else {
      // Nested IF for additional conditions
      formula += `, IF(${parts[i]}:${parts[i]}="${parts[i+1]}", "${parts[i+2]}"`;
    }
  }
  
  // Close all the IF statements
  for (let i = 3; i < parts.length - 1; i += 3) {
    formula += ')';
  }
  
  formula += ')';
  return formula;
}

// Start the server
app.listen(port, () => {
  console.log(`FormulaForge server listening at http://localhost:${port}`);
});