/* eslint quotes: ["error", "single", {"avoidEscape": true}] */
import {csvParse} from './csv-parse.js';

test('csv parse', () => {
   // Quotes
   expect(csvParse('a,b\nc,d', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // without quotes
   expect(csvParse('"a","b"\n"c","d"', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // with quotes
   expect(csvParse('"a",b\nc,"d"', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // mixed with and without quotes
   expect(() => csvParse('"a","b\nc,d', ',')).toThrow({name: 'CSVParseError', message: 'Quote not closed', offsetStart: 4, offsetEnd: 5}); // unclosed quote
   expect(csvParse('aa,b"b\nc""c,dd"', ',')).toStrictEqual([['aa', 'b"b'], ['c""c', 'dd"']]);  // unquoted values may contain quotes, as long as they are not at the beginning of the value. These should not be unescaped.
   expect(csvParse('"a""a","bb"\n"c""""c","dd"', ',')).toStrictEqual([['a"a', 'bb'], ['c""c', 'dd']]);  // quoted values may contain escaped quotes. These should be unescaped (by replacing each pair of quotes with a single quote).
   expect(() => csvParse('"a""a","bb"\n"c"c","dd"', ',')).toThrow({name: 'CSVParseError', message: "unexpected token 'c'", offsetStart: 15, offsetEnd: 16}); // quoted values cannot contain unescaped quotes
   // Line breaks
   expect(csvParse('a,b\nc,d', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // LF
   expect(csvParse('a,b\r\nc,d', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // CRLF
   expect(csvParse('a,b\rc,d', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // CR
   expect(csvParse('"a","b"\n"c","d"', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // LF with quotes
   expect(csvParse('"a","b"\r\n"c","d"', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // CRLF with quotes
   expect(csvParse('"a","b"\r"c","d"', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // CR with quotes
   expect(csvParse('a,b\nc,d\n', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // LF with line break at end of file
   expect(csvParse('a,b\r\nc,d\r\n', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // CRLF with line break at end of file
   expect(csvParse('a,b\rc,d\r', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // CR with line break at end of file
   expect(csvParse('"a\na","b\rb"\n"c\r\nc","dd"', ',')).toStrictEqual([['a\na', 'b\rb'], ['c\r\nc', 'dd']]);  // line break in quoted value
   // separators
   expect(csvParse('a,b\nc,d', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // comma separated
   expect(csvParse('a\tb\nc\td', '\t')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // tab separated
   expect(csvParse('a,b\nc,d', '\t')).toStrictEqual([['a,b'], ['c,d']]);  // commas in tab separated
   expect(csvParse('a\tb\nc\td', ',')).toStrictEqual([['a\tb'], ['c\td']]);  // tabs in comma separated
   expect(csvParse('"a,a","b\tb"\n"cc","dd"', ',')).toStrictEqual([['a,a', 'b\tb'], ['cc', 'dd']]);  // quoted separators in comma separated
   expect(csvParse('"a,a"\t"b\tb"\n"cc"\t"dd"', '\t')).toStrictEqual([['a,a', 'b\tb'], ['cc', 'dd']]);  //quoted separators in tab separated
   // table dimensions
   expect(csvParse('a,b\nc,d', ',')).toStrictEqual([['a', 'b'], ['c', 'd']]);  // 2x2
   expect(csvParse('a', ',')).toStrictEqual([['a']]);  // 1x1
   expect(csvParse('\n', ',')).toStrictEqual([['']]);  // 1x1 empty
   expect(csvParse('a, \n,', ',')).toStrictEqual([['a', ' '], ['', '']]);  // empty and spaces
   expect(() => csvParse('', ',')).toThrow({name: 'CSVParseError', message: 'no data', offsetStart: 0, offsetEnd: 0}); // no data
   expect(() => csvParse('a,b,c\nd,e,f\ng,h\ni,j,k', ',')).toThrow({name: 'CSVParseError', message: 'row 3 has 2 cells, expected 3', offsetStart: 12, offsetEnd: 15}); // 3+3+2+3 not all rows have same length
});
