"use client";
import { useState, useEffect } from "react";
import Header from "../header";
import SEO from "./../../seo/page";
import { jsPDF } from "jspdf";
import Icon from "@/app/pages/socialmedia-icons/page";
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
      const monthlyInterestRate = interestRateValue / 100 / 12;

      monthlyPayment =
        (totalLoanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalMonthsValue)) /
        (Math.pow(1 + monthlyInterestRate, totalMonthsValue) - 1);

      totalLoanAmount = monthlyPayment * totalMonthsValue;
    }

    const totalInterest = totalLoanAmount - amountValue;

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
    const margin = 14.2;
    const doc = new jsPDF({ unit: "mm", format: "letter" });

    // Set the colors
    const topColor = [0, 43, 71]; // RGB for #002B47 (dark blue)
    const blackColor = [0, 0, 0]; // RGB for black

    // Page dimensions
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const topHalfHeight = pageHeight / 2; // Define the top half height

    // Set the page height to the top half
    doc.internal.pageSize.height = topHalfHeight; // Adjust page size to use only top half

    // Draw a thin black border around the top half of the page
    const borderThickness = 1;
    doc.setLineWidth(borderThickness);
    doc.setDrawColor(...blackColor);
    doc.rect(0, 0, pageWidth, topHalfHeight); // Draw border only on the top half of the page

    // Fill the top half with #002B47 (dark blue)
    doc.setFillColor(...topColor); // Set fill color to #002B47
    doc.rect(0, 0, pageWidth, topHalfHeight, "F"); // Fill the top half with color

    // Set text color to white to ensure visibility on dark background
    doc.setTextColor(255, 255, 255);

    // Image Path (Ensure logo is in the public folder)
    const imgPath = "/logo.png"; // Make sure this is the correct path
    const imgWidth = 40; // Width of the image
    const imgHeight = 10; // Height of the image

    // Add the logo image to the PDF (Position logo on the left)
    try {
      doc.addImage(
        imgPath,
        "PNG",
        margin, // Position logo to the left
        margin + 0, // Elevate the logo slightly higher
        imgWidth,
        imgHeight
      );
    } catch (error) {
      console.error("Error adding image to PDF:", error);
    }

    // Add the Loan Payment Summary title next to the logo
    doc.setFontSize(26);
    doc.setFont("times", "bold");
    doc.text("| Loan Payment Summary", margin + imgWidth + 5, margin + 8, {
      align: "left", // Align to the left of the logo
    });

    // Table Data
    const tableData = [
      [
        "Period",
        `${loanDetails.selectedYears} Years, ${loanDetails.selectedMonths} Months`,
      ],
      [
        "Monthly Payment",
        `PHP ${loanDetails.monthlyPayment.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      ],
      [
        "Total Payment",
        `PHP ${loanDetails.totalLoan.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      ],
      [
        "Total Loan",
        `PHP ${(loanDetails.totalLoan - loanDetails.loanAmount).toLocaleString(
          undefined,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}`,
      ],
    ];

    const startX = margin;
    let startY = margin + 25; // Adjust startY to accommodate the new top content and logo
    const rowHeight = 15;
    const columnWidth = (pageWidth - 2 * margin) / 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);

    // Add Table Headers
    const headerPadding = 5;
    const headerTexts = tableData.map((row) => row[0]);
    headerTexts.forEach((header, index) => {
      doc.text(
        header,
        startX + index * columnWidth + columnWidth / 2,
        startY + headerPadding,
        { align: "center" }
      );
    });

    // Add Table Values
    doc.setFontSize(12);
    const valuePadding = 5;

    const valueTexts = tableData.map((row) => row[1]);
    valueTexts.forEach((value, index) => {
      const valueX = startX + index * columnWidth + columnWidth / 2;
      doc.text(value, valueX, startY + rowHeight + valuePadding, {
        align: "center",
      });
    });

    // Add Table Borders
    doc.setLineWidth(0.05);
    const tableHeight = rowHeight * 2;
    tableData.forEach((_, index) => {
      doc.rect(
        startX + index * columnWidth - 2,
        startY - 4,
        columnWidth,
        tableHeight
      );
    });

    // Add Notes
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const noteText =
      "* Please note that the results provided by this calculator are estimates and may vary. The final loan amount, interest rates, and monthly payments will be determined by the bank upon approval.";
    doc.text(noteText, 105, startY + tableHeight + 10, {
      align: "center",
      maxWidth: pageWidth - 2 * margin,
    });

    // Add Thank You Note
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Thank you for using our Loan Calculator",
      105,
      startY + tableHeight + 25,
      { align: "center" }
    );

    // Add Contact Information
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const contactInfo = [
      "Email: info@alveoland.com.ph",
      "Customer Hotline: (+632) 8848 5000",
      "Location: Alveo Corporate Center 728 28th Street, Bonifacio Global City",
      "1634 Taguig City, Metro Manila Philippines",
    ];
    contactInfo.forEach((line, index) => {
      doc.text(line, 105, startY + tableHeight + 35 + index * 5, {
        align: "center",
        maxWidth: pageWidth - 2 * margin,
      });
    });

    // Add Copyright Notice
    doc.setFontSize(8);
    const copyrightText =
      "Copyright © 2024 All Rights Reserved by Infinitech Advertising Corporation";
    doc.text(copyrightText, 105, startY + tableHeight + 65, {
      align: "center",
    });

    // Save the PDF
    doc.save("loan_calculator_summary.pdf");
  };

  return (
    <>
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
        keywords="alveo, real estate, property sale, property investment, property price, property loan, building price, condiminium loan"
        canonical="${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/loancalculator"
      />
      <Header /> <Icon />
      <main
        className="min-h-screen bg-cover bg-center "
        style={{ backgroundImage: "url('/assets/Alveo.png')" }}
      >
        <div className="absolute inset-0 bg-customBlue opacity-80 z-0 max-sm:h-[225%] sm:h-[145%] md:h-[140%] lg:h-[130%] xl:h-[120%] 2xl:h-[115%]"></div>

        <section className="relative z-20 py-10 p-2 text-customBlue ">
          <h1
            className="mt-10 mb-5 font-semibold items-center text-3xl text-white 
      border-t-2 w-fit mx-auto border-white whitespace-nowrap"
          >
            LOAN CALCULATOR
          </h1>
          <div className="max-w-7xl  mx-auto p-8 bg-white shadow-xl">
            <div className="space-y-8 xl:space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <label
                    htmlFor="years"
                    className="block text-lg font-semibold text-customBlue"
                  >
                    Years
                  </label>
                  <select
                    id="years"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="w-full p-3 border border-customBlue
                     text-md transition duration-300 focus:ring-2 focus:ring-customBlue"
                  >
                    <option value="0">Select Years</option>
                    {[...Array(25)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} Year{i + 1 > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="months"
                    className="block text-lg font-semibold text-customBlue"
                  >
                    Months
                  </label>
                  <select
                    id="months"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    className="w-full p-3 border border-customBlue  text-md transition duration-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0">Select Months</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i}>
                        {i} Month{i > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="block text-lg font-semibold text-customBlue"
                  >
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(formatNumber(e.target.value))}
                    className="w-full p-3 border border-customBlue  text-sm transition duration-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Amount"
                  />
                </div>

                <div>
                  <label
                    htmlFor="interest"
                    className="block text-lg font-semibold text-customBlue"
                  >
                    Interest (%)
                  </label>
                  <input
                    type="number"
                    id="interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full p-3 border border-customBlue  text-sm transition duration-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Interest Rate"
                  />
                </div>
              </div>

              {/* Loan Summary */}
              <div className="mt-8">
                <h5 className="text-2xl font-semibold mb-6 text-customBlue">
                  Loan Summary
                </h5>
                <table className="min-w-full table-auto border-collapse border border-customBlue text-lg">
                  <thead>
                    <tr className="bg-customBlue">
                      <th className="px-6 py-3 text-left text-sm font-thin text-white">
                        Detail
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-thin text-white">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-6 py-3 border border-customBlue">
                        Selected Years
                      </td>
                      <td className="px-6 py-3 border border-customBlue">
                        {loanDetails.selectedYears} Years,{" "}
                        {loanDetails.selectedMonths} Months
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 border border-customBlue">
                        Loan Amount
                      </td>
                      <td className="px-6 py-3 border border-customBlue">
                        ₱{" "}
                        {loanDetails.loanAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 border border-customBlue">
                        Interest Rate
                      </td>
                      <td className="px-6 py-3 border border-customBlue">
                        {loanDetails.interestRate}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 border border-customBlue">
                        Total Loan Amount (with Interest)
                      </td>
                      <td className="px-6 py-3 border border-customBlue">
                        ₱{" "}
                        {loanDetails.totalLoan.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 border border-customBlue">
                        Monthly Payment
                      </td>
                      <td className="px-6 py-3 border border-customBlue">
                        ₱{" "}
                        {loanDetails.monthlyPayment.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 border border-customBlue">
                        Total Months
                      </td>
                      <td className="px-6 py-3 border border-customBlue">
                        {loanDetails.totalMonths} Months
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-sm text-gray-500 mt-4">
                  * Please note that the results provided by this calculator are
                  estimates and may vary. The final loan amount, interest rates,
                  and monthly payments will be determined by the bank upon
                  approval.
                </div>
                <button
                  onClick={exportPDF}
                  className="mt-8 px-6 py-3 bg-customBlue text-white  hover:bg-customBlue"
                >
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
