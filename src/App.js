import React, { useState, useEffect } from "react";
import Worksheet from "./components/Worksheet";
import seedrandom from "seedrandom";

const App = () => {
    const [seed, setSeed] = useState("");
    const [problems, setProblems] = useState({ page1: [], page2: [] });

    useEffect(() => {
        const date = new Date();
        setSeed(`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`);
        const rng = seedrandom(seed);
        const page1 = [];
        const page2 = [];

        console.log(seed, `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`);

        // Generate a fixed random number for Page 1
        const fixedNumber = Math.floor(rng() * 101);

        // Page 1: Fixed number + Random number
        for (let i = 0; i < 10; i++) {
            const randomOperand = Math.floor(rng() * 101);
            const operation = rng() > 0.5 ? "+" : "-";

            if (operation === "+" || (operation === "-" && fixedNumber >= randomOperand)) {
                page1.push({ num1: fixedNumber, num2: randomOperand, operation });
            } else {
                page1.push({ num1: randomOperand, num2: fixedNumber, operation });
            }
        }

        // Page 2: Fully random problems
        for (let i = 0; i < 10; i++) {
            const num1 = Math.floor(rng() * 101);
            const num2 = Math.floor(rng() * 101);
            const operation = rng() > 0.5 ? "+" : "-";

            if (operation === "+" || (operation === "-" && num1 >= num2)) {
                page2.push({ num1, num2, operation });
            } else {
                page2.push({ num1: num2, num2: num1, operation });
            }
        }

        setProblems({ page1, page2 });
    }, [seed]);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Daily Math Worksheets!</h1>
            {/* <input
                type="text"
                placeholder="Enter seed (optional)"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                style={{ padding: "10px", margin: "10px" }}
            /> */}
            {/* <button onClick={generateProblems} style={{ padding: "10px 20px" }}>
                Generate Worksheet
            </button> */}
            {problems.page1.length > 0 && <Worksheet problems={problems} timestamp={seed} />}
        </div>
    );
};

export default App;
