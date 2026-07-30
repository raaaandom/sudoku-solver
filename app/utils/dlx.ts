class DLXNode {
  left: DLXNode;
  right: DLXNode;
  up: DLXNode;
  down: DLXNode;
  column: ColumnNode;

  rowID?: [number, number, number];

  constructor(column: ColumnNode) {
    this.left = this;
    this.right = this;
    this.up = this;
    this.down = this;
    this.column = column;
  }
}

class ColumnNode extends DLXNode {
  size: number = 0;
  name: string;

  constructor(name: string) {
    super(null as unknown as ColumnNode);
    this.column = this;
    this.name = name;
  }
}

class DLXSolver {
    root: ColumnNode;
    solution: DLXNode[] = [];
    isSolved: boolean = false;

    constructor(root: ColumnNode) {
        this.root = root;
    }

    // Nasconde una colonna e tutte le righe che la intersecano
    cover(c: ColumnNode) {
        c.right.left = c.left;
        c.left.right = c.right;

        for (let i = c.down; i !== c; i = i.down) {
            for (let j = i.right; j !== i; j = j.right) {
                j.down.up = j.up;
                j.up.down = j.down;
                j.column.size--;
            }
        }
    }

    // Ripristina la colonna esattamente come prima
    uncover(c: ColumnNode) {
        for (let i = c.up; i !== c; i = i.up) {
            for (let j = i.left; j !== i; j = j.left) {
                j.column.size++;
                j.down.up = j;
                j.up.down = j;
            }
        }
        c.right.left = c;
        c.left.right = c;
    }

    // La ricerca ricorsiva (backtracking)
    search() {
        if (this.isSolved) return;

        // Se la root punta a se stessa, abbiamo esaurito le colonne: Vittoria!
        if (this.root.right === this.root) {
            this.isSolved = true;
            return;
        }

        // Euristiche: scegli la colonna con meno candidati per ridurre i rami
        let c = this.root.right as ColumnNode;
        for (let temp = c.right as ColumnNode; temp !== this.root; temp = temp.right as ColumnNode) {
            if (temp.size < c.size) c = temp;
        }

        this.cover(c);

        for (let r = c.down; r !== c; r = r.down) {
            this.solution.push(r);
            for (let j = r.right; j !== r; j = j.right) this.cover(j.column);

            this.search(); // Chiamata ricorsiva
            if (this.isSolved) return;

            // Backtracking: mossa sbagliata, si annulla
            r = this.solution.pop()!;
            for (let j = r.left; j !== r; j = j.left) this.uncover(j.column);
        }

        this.uncover(c);
    }
}

function solveSudoku(grid: number[][]): number[][] | null {
    const root = new ColumnNode("Root");
    const columns: ColumnNode[] = [];

    // Creiamo le 324 colonne (Vincoli)
    for (let i = 0; i < 324; i++) {
        const col = new ColumnNode(i.toString());
        columns.push(col);

        // Colleghiamo le colonne orizzontalmente alla Root
        col.left = root.left;
        col.right = root;
        root.left.right = col;
        root.left = col;
    }

    // Funzione helper per aggiungere una riga di "1" alla matrice
    function addRow(r: number, c: number, v: number) {
        // Calcolo degli indici esatti delle 4 colonne per questa mossa
        const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        const cellConstraint = r * 9 + c;
        const rowConstraint = 81 + r * 9 + v;
        const colConstraint = 162 + c * 9 + v;
        const boxConstraint = 243 + box * 9 + v;

        const indices = [cellConstraint, rowConstraint, colConstraint, boxConstraint];
        let firstNode: DLXNode | null = null;

        for (const idx of indices) {
            const col = columns[idx];
            const node = new DLXNode(col);
            node.rowID = [r, c, v + 1]; // Salviamo i dati (v+1 perché usiamo 0-8 nell'indice)

            // Inserimento in fondo alla colonna
            node.up = col.up;
            node.down = col;
            col.up.down = node;
            col.up = node;
            col.size++;

            // Collegamento orizzontale
            if (!firstNode) {
                firstNode = node;
            } else {
                node.left = firstNode.left;
                node.right = firstNode;
                firstNode.left.right = node;
                firstNode.left = node;
            }
        }
    }

    // Costruiamo le righe (Scelte)
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const val = grid[r][c];
            if (val === 0) {
                // Cella vuota: proviamo tutti e 9 i numeri (da 0 a 8 internamente)
                for (let v = 0; v < 9; v++) addRow(r, c, v);
            } else {
                // Cella precompilata: aggiungiamo solo l'unica scelta forzata
                addRow(r, c, val - 1);
            }
        }
    }

    // Facciamo partire il risolutore
    const solver = new DLXSolver(root);
    solver.search();

    if (!solver.isSolved) return null;

    // Ricostruiamo la griglia del Sudoku leggendo i `rowID` salvati nella soluzione
    const solvedGrid = grid.map(row => [...row]); // Clona la griglia
    for (const node of solver.solution) {
        if (node.rowID) {
            const [r, c, v] = node.rowID;
            solvedGrid[r][c] = v;
        }
    }

    return solvedGrid;
}

function parseSudokuString(sudokuString: string): number[][] {
    // Rimuove eventuali spazi bianchi o newline per sicurezza
    const cleanString = sudokuString.replace(/\s+/g, '');

    if (cleanString.length !== 81) {
        throw new Error(`La stringa deve contenere esattamente 81 cifre. Ne hai fornite ${cleanString.length}.`);
    }

    const grid: number[][] = [];

    for (let r = 0; r < 9; r++) {
        // Estraiamo i 9 caratteri corrispondenti alla riga corrente
        const rowString = cleanString.slice(r * 9, (r + 1) * 9);

        // Mappiamo ogni carattere in un numero (sostituendo il '.' con 0)
        const rowNumbers = rowString.split('').map(char => {
            if (char === '.') return 0;
            return parseInt(char, 10) || 0; // Il fallback a 0 gestisce anche eventuali caratteri non numerici
        });

        grid.push(rowNumbers);
    }

    return grid;
}

export function solveFromString(s: string) {
    return solveSudoku(parseSudokuString(s))
}
