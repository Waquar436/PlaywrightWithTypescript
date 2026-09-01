/** 
 * Dedmo feamework - Authentication / storageState shared paths: utils/auth-paths.ts
 * 
 * Plain module (Not a test file) holding the storageState file locations.
 * Both auth.setup.ts (which WRITES them) and the specs (Which READ them) import
 * from here. Keeping these constants out of auth.setup.ts matters: playwright
 * forbids importing one test file from another, and auth.setup.ts is a test 
 * file, so the path must live in a non-test module like this one.
 * 
 * path.join keeps this working on windos and macOS/Linux alike.
 */
import * as path from 'path';
import * as fs from 'fs';

// Framework root is one level up from /utils.
export const authDir = path.join(__dirname,'..','.auth');
fs.mkdirSync(authDir,{ recursive: true });

export const STANDARD_STATE = path.join(authDir,'standard.json');
export const PROBLEM_STATE = path.join(authDir, 'problem.json');