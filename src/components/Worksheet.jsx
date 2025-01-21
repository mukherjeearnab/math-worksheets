import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./index.css"; // Import the CSS file

const Worksheet = ({ problems, timestamp }) => {
    const worksheetRef = useRef();
    const date = new Date(parseInt(timestamp));

    const generatePDF = async () => {
        const element = worksheetRef.current;

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
        });

        const pdf = new jsPDF("p", "mm", "a4");
        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`math-worksheet-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.pdf`);
    };

    const generateAnswers = () => {
        const allProblems = [...problems.page1, ...problems.page2];
        return allProblems
            .map((problem, index) => {
                const statement = `${problem.num1} ${problem.operation} ${problem.num2}`;
                const lhs = `${index + 1}: ${statement}`;

                return `${lhs} = ${
                    problem.operation === "+" ? problem.num1 + problem.num2 : problem.num1 - problem.num2
                }\n`;
            })
            .join("\n");
    };

    const generateProblemRows = (problem, index) => {
        const buffer = 14;
        const statement = `${problem.num1} ${problem.operation} ${problem.num2}`;
        const lhs = `${index + 1}: ${statement}`;
        console.log(buffer, lhs.length);
        return (
            <div key={index} className="problem-box">
                <span className="problem-number">{index+1}.&nbsp;</span><span>{`${statement}${"\u00A0" + "\u00A0".repeat(buffer - lhs.length)}= `}</span>
                <div className="answer-box"></div>
            </div>
        );
    };

    return (
        <div>
            {/* Download Button */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={generatePDF} className="download-button">
                    Download PDF
                </button>
            </div>
            <div ref={worksheetRef} className="worksheet-container">
                {/* Page 1: Fixed Number Problems */}
                <div className="worksheet-page">
                    <h1>Worksheet for {date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</h1>
                    <h2 className="page-title">Type 1: Similar Number Problems</h2>
                    <div className="problem-grid">
                        {problems.page1.map((problem, index) => {
                            return generateProblemRows(problem, index);
                        })}
                    </div>
                    {/* <div className="qr-code-container">
                        <QRCodeCanvas value={generateAnswers()} size={200} />
                    </div> */}
                </div>

                {/* Page 2: Fully Random Problems */}
                <div className="worksheet-page">
                    <h2 className="page-title">Type 2: Random Number Problems</h2>
                    <div className="problem-grid">
                        {problems.page2.map((problem, index) => {
                            return generateProblemRows(problem, index + 10);
                        })}
                    </div>
                    <div className="qr-code-container">
                        <QRCodeCanvas value={generateAnswers()} size={180} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Worksheet;
