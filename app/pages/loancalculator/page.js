"use client"
import { useState, useEffect } from "react";
import Header from "../header"
import SEO from "./../../seo/page"
import { jsPDF } from 'jspdf';
export default function LoanCalculator() {
    const [years, setYears] = useState(0);
    const [months, setMonths] = useState(0);
    const [amount, setAmount] = useState("");
    const [interest, setInterest] = useState("");

    const [loanDetails, setLoanDetails] = useState({
        selectedYears: 0,
        selectedMonths: 0,
        loanAmount: 0,
        interestRate: 0,
        totalLoan: 0,
        monthlyPayment: 0,
        totalMonths: 0,
    });

    useEffect(() => {
        calculateLoan();
    }, [years, months, amount, interest]);

    const formatNumber = (value) => {
        return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
const calculateLoan = () => {
    const yearsValue = parseInt(years) || 0;
    const monthsValue = parseInt(months) || 0;
    const amountValue = parseFloat(amount.replace(/,/g, "")) || 0;
    const interestRateValue = parseFloat(interest) || 0;

    const totalMonthsValue = yearsValue * 12 + monthsValue;

    let totalLoanAmount = amountValue;
    let monthlyPayment = 0;

    if (totalMonthsValue > 0 && interestRateValue > 0) {
        // Monthly Interest Rate
        const monthlyInterestRate = interestRateValue / 100 / 12;

        // Amortization Formula for Monthly Payment
        monthlyPayment = (totalLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonthsValue)) / (Math.pow(1 + monthlyInterestRate, totalMonthsValue) - 1);

        // Total Loan Amount (Principal + Interest)
        totalLoanAmount = monthlyPayment * totalMonthsValue;
    }

    // Calculate Total Interest
    const totalInterest = totalLoanAmount - amountValue;

    // Set Loan Details to State
    setLoanDetails({
        selectedYears: yearsValue,
        selectedMonths: monthsValue,
        loanAmount: amountValue,
        interestRate: interestRateValue,
        totalLoan: totalLoanAmount,
        monthlyPayment,
        totalInterest,
        totalMonths: totalMonthsValue,
    });
};
    const exportPDF = () => {
    const margin = 14.2;  // Convert 0.5 inches to mm (1 inch = 25.4mm, so 0.5 * 25.4 = 12.7mm, rounded to 14.2mm for consistency)
    const doc = new jsPDF({ unit: "mm", format: "letter" });  // Set to letter size (8.5" x 11")

    // Title Section - Larger font and centered
    doc.setFontSize(22);
    doc.setFont("times", "bold");  // Change font to Times for title
    doc.text("Loan Payment Summary", 105, margin + 10, { align: "center" });  // Added padding top for header

    // Define the loan data
    const tableData = [
        ["Period", `${loanDetails.selectedYears} Years, ${loanDetails.selectedMonths} Months`],
        ["Monthly Payment", `PHP ${loanDetails.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
        ["Total Payment", `PHP ${loanDetails.totalLoan.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
        ["Total Loan", `PHP ${(loanDetails.totalLoan - loanDetails.loanAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ];

    const startX = margin;  // Start drawing the table from the margin
    let startY = margin + 30;  // Start below the title (with padding for header)
    const rowHeight = 15;  // Adjusted row height for better readability
    const columnWidth = (doc.internal.pageSize.width - (2 * margin)) / 4;  // Ensure the columns fit within the page width

    // Apply font style (using Arial for the table content)
    doc.setFont("helvetica", "normal"); // Use Helvetica font for table content, which supports special characters

    // Enlarge font size for headers only
    doc.setFontSize(14); // Set a larger font size for headers

    // Add padding for header
    const headerPadding = 5; // Padding for header text

    // Draw the table headers - centralize headers with padding
    const headerTexts = tableData.map(row => row[0]);
    headerTexts.forEach((header, index) => {
        doc.text(header, startX + (index * columnWidth) + (columnWidth / 2), startY + headerPadding, { align: "center" });
    });

    // Set normal font size for table content
    doc.setFontSize(12);

    // Add padding for table values
    const valuePadding = 5; // Padding for value cells

    // Draw the table values below the headers - center values with padding
    const valueTexts = tableData.map(row => row[1]);
    valueTexts.forEach((value, index) => {
        const valueX = startX + (index * columnWidth) + (columnWidth / 2);
        doc.text(value, valueX, startY + rowHeight + valuePadding, { align: "center" });
    });

    // Add subtle borders to the table for better separation (slightly visible)
    doc.setLineWidth(0.05);  // Reduced line width for subtle visibility
    const tableHeight = rowHeight * 2;
    tableData.forEach((_, index) => {
        doc.rect(startX + index * columnWidth - 2, startY - 4, columnWidth, tableHeight);
    });

    // Add a section for notes - clearer disclaimer, centralized
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal"); // Ensure the correct font is used for the note
    const noteText = "* Please note that the results provided by this calculator are estimates and may vary. The final loan amount, interest rates, and monthly payments will be determined by the bank upon approval.";
    doc.text(noteText, 105, startY + tableHeight + 10, { align: "center", maxWidth: doc.internal.pageSize.width - (2 * margin) });

    // Footer Section - Centered "Thank you" message
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal"); // Use Helvetica for footer
    doc.text("Thank you for using our Loan Calculator", 105, startY + tableHeight + 25, { align: "center" });

    // Save the PDF
    doc.save('loan_calculator_summary.pdf');
};





// Button to trigger the PDF export

return (
    <>
     <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, property sale, property investment, property price, property loan, building price, condiminium loan"
  canonical="https://realstate-frontend-alveo.vercel.app/pages/loancalculator"
/>

    <Header/>
        <main className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/hero.png')" }}>
            <section className="relative w-full h-20 bg-cover bg-center flex justify-center items-center" style={{ backgroundImage: "url('/hero.png')" }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <h1 className="text-white text-3xl font-bold z-10">Loan Calculator</h1>
            </section>

          <section className="py-12 bg-gray-100 ">
    <div className="max-w-7xl  mx-auto p-8 bg-white rounded-xl shadow-xl">
        <div className="space-y-8 xl:space-y-2">
            {/* Input Fields - Horizontal Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <label htmlFor="years" className="block text-lg font-semibold text-gray-700">Years</label>
                    <select
                        id="years"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-xl transition duration-300 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="0">Select Years</option>
                        {[...Array(25)].map((_, i) => (
                            <option key={i} value={i + 1}>{i + 1} Year{(i + 1) > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="months" className="block text-lg font-semibold text-gray-700">Months</label>
                    <select
                        id="months"
                        value={months}
                        onChange={(e) => setMonths(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-xl transition duration-300 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="0">Select Months</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i} value={i}>{i} Month{(i > 1) ? 's' : ''}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-lg font-semibold text-gray-700">Amount</label>
                    <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(formatNumber(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg text-xl transition duration-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Amount"
                    />
                </div>

                <div>
                    <label htmlFor="interest" className="block text-lg font-semibold text-gray-700">Interest (%)</label>
                    <input
                        type="number"
                        id="interest"
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-xl transition duration-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Interest Rate"
                    />
                </div>
            </div>

            {/* Loan Summary */}
            <div className="mt-8">
                <h5 className="text-2xl font-semibold mb-6 text-gray-800">Loan Summary</h5>
                <table className="min-w-full table-auto border-collapse border border-gray-300 text-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Detail</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-6 py-3 border border-gray-300">Selected Years</td>
                            <td className="px-6 py-3 border border-gray-300">{loanDetails.selectedYears} Years, {loanDetails.selectedMonths} Months</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-3 border border-gray-300">Loan Amount</td>
                            <td className="px-6 py-3 border border-gray-300">₱ {loanDetails.loanAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-3 border border-gray-300">Interest Rate</td>
                            <td className="px-6 py-3 border border-gray-300">{loanDetails.interestRate}%</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-3 border border-gray-300">Total Loan Amount (with Interest)</td>
                            <td className="px-6 py-3 border border-gray-300">₱ {loanDetails.totalLoan.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-3 border border-gray-300">Monthly Payment</td>
                            <td className="px-6 py-3 border border-gray-300">₱ {loanDetails.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-3 border border-gray-300">Total Months</td>
                            <td className="px-6 py-3 border border-gray-300">{loanDetails.totalMonths} Months</td>
                        </tr>
                    </tbody>
                </table>

                <div className="text-sm text-gray-500 mt-4">
                    * Please note that the results provided by this calculator are estimates and may vary. The final loan amount, interest rates, and monthly payments will be determined by the bank upon approval.
                </div>
                <button onClick={exportPDF} className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  Export as PDF
</button>
            </div>
        </div>
    </div>
</section>

        </main>
            </>
    );
}