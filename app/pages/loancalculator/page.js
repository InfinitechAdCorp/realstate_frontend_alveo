"use client"
import { useState, useEffect } from "react";
import Header from "../header"
import SEO from "./../../seo/page"
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
        if (totalMonthsValue > 0 && interestRateValue > 0) {
            const monthlyInterestRate = interestRateValue / 100 / 12;
            totalLoanAmount = amountValue * Math.pow(1 + monthlyInterestRate, totalMonthsValue);
        }

        let monthlyPayment = 0;
        if (totalMonthsValue > 0) {
            monthlyPayment = totalLoanAmount / totalMonthsValue;
        }

        setLoanDetails({
            selectedYears: yearsValue,
            selectedMonths: monthsValue,
            loanAmount: amountValue,
            interestRate: interestRateValue,
            totalLoan: totalLoanAmount,
            monthlyPayment,
            totalMonths: totalMonthsValue,
        });
    };
return (
    <>
     <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, property sale, property investment, property price, property loan, building price, condiminium loan"
  canonical="http://localhost:3000/pages/loancalculator"
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
            </div>
        </div>
    </div>
</section>

        </main>
            </>
    );
}