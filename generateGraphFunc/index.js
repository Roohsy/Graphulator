import { Firestore } from "@google-cloud/firestore";

const firestore = new Firestore();

// Color list
const COLORS = [
    "rgb(31, 119, 180)",   // Blue
    "rgb(255, 127, 14)",   // Orange
    "rgb(44, 160, 44)",    // Green
    "rgb(214, 39, 40)",    // Red
    "rgb(148, 103, 189)",  // Purple
    "rgb(140, 86, 75)",    // Brown
    "rgb(227, 119, 194)",  // Pink
    "rgb(127, 127, 127)",  // Gray
    "rgb(188, 189, 34)",   // Olive
    "rgb(23, 190, 207)",   // Cyan
];

// Normalize function input
function normalizeFunction(func) {
    func = func.replace(/\s+/g, ""); // Remove all spaces

    // Handle vertical line expressions
    if (/^x=\-?\d+(\.\d+)?$/.test(func)) {
        const [, value] = func.match(/^x=(\-?\d+(\.\d+)?)/);
        return { isVertical: true, xValue: parseFloat(value) };
    }

    // Remove "y=" prefix if present
    if (func.startsWith("y=")) {
        func = func.slice(2);
    }

    // Replace `^` with `**` for exponentiation
    func = func.replace(/(\w|\))\^(\w|\()/g, "$1**$2");

    // Replace common math functions with JavaScript equivalents
    func = func.replace(/\bsin\(/g, "Math.sin(")
        .replace(/\bcos\(/g, "Math.cos(")
        .replace(/\btan\(/g, "Math.tan(")
        .replace(/\bexp\(/g, "Math.exp(")
        .replace(/\blog\(/g, "Math.log(")
        .replace(/\bsqrt\(/g, "Math.sqrt(")
        .replace(/\bpow\(/g, "Math.pow(");

    return { isVertical: false, func: `(x) => ${func}` };
}

// Generate graph points
function generateGraphPoints(funcs, range, steps = 200) {
    const allPoints = [];

    funcs.forEach((func, index) => {
        const points = {
            x: [],
            y: [],
            name: func,
            color: COLORS[index % COLORS.length],
        };
        const step = (range.max - range.min) / steps;

        const normalizedFunc = normalizeFunction(func);
        if (normalizedFunc.isVertical) {
            const xValue = normalizedFunc.xValue;
            for (let y = range.min; y <= range.max; y += step) {
                points.x.push(xValue);
                points.y.push(y);
            }
        } else {
            const f = new Function("x", `return ${normalizedFunc.func}`)();
            for (let x = range.min; x <= range.max; x += step) {
                try {
                    const y = f(x);
                    if (!isNaN(y) && isFinite(y)) {
                        points.x.push(x);
                        points.y.push(y);
                    }
                } catch (error) {
                    console.error("Error calculating point:", error);
                }
            }
        }
        allPoints.push(points);
    });

    return allPoints;
}

export const generateGraph = async (req, res) => {
    const { functions, range } = req.body;

    try {
        const graphPoints = generateGraphPoints(functions, range);
        // return the data to frontend
        res.json(graphPoints); 

        // save to firestore
        const graphId = `graph-${Date.now()}`;
        await firestore.collection("graphs").add({
            functions,
            graphPoints,
            graphId,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error generating graph data:", error);
        res.status(500).json({ error: "Failed to generate graph data" });
    }
};
