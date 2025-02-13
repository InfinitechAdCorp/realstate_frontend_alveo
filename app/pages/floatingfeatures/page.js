"use client"; // Add this to mark the component as a Client Component

import { IoManSharp, IoBed } from "react-icons/io5";
import { FaCalculator, FaCalendarAlt, FaHome } from "react-icons/fa";

const FloatingFeatures = ({ isAccessible, handleShowWarningToast }) => {
  const iconDetails = [
    {
      link: "/pages/roomplanner",
      icon: <IoBed className="w-8 h-8 text-customBlue" />,
      label: "Room Planner",
      isAccessible: isAccessible,
      accessibleLink: "/pages/roomplanner",
      inaccessibleMessage: "Room Planner is not available on smaller screens.",
    },
    {
      link: "/pages/loancalculator",
      icon: <FaCalculator className="w-8 h-8 text-customBlue" />,
      label: "Loan Calculator",
    },
    {
      link: "/pages/set-appointment",
      icon: <FaCalendarAlt className="w-8 h-8 text-customBlue" />,
      label: "Set Appointment",
    },
    {
      link: "/pages/add-property",
      icon: <FaHome className="w-8 h-8 text-customBlue" />,
      label: "Submit Property",
    },
    {
      link: "/pages/agent",
      icon: <IoManSharp className="w-8 h-8 text-customBlue" />,
      label: "Agent",
    },
  ];

  return (
    <div className="fixed top-20 right-1 z-10 lg:top-13 lg:right-2 flex space-x-2">
      {iconDetails.map((iconData, index) => (
        <FeatureIcon
          key={index}
          {...iconData}
          handleShowWarningToast={handleShowWarningToast}
        />
      ))}
    </div>
  );
};

const FeatureIcon = ({
  link,
  icon,
  label,
  isAccessible,
  accessibleLink,
  inaccessibleMessage,
  handleShowWarningToast,
}) => {
  return (
    <div className="flex justify-center items-center z-50">
      <div className="bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
        {isAccessible !== undefined ? (
          isAccessible ? (
            <a href={accessibleLink} target="_blank" rel="noopener noreferrer">
              <IconWithTooltip icon={icon} label={label} />
            </a>
          ) : (
            <div
              className="cursor-not-allowed opacity-50"
              onClick={() =>
                handleShowWarningToast(inaccessibleMessage, "warning")
              }
            >
              {icon}
            </div>
          )
        ) : (
          <a href={link}>
            <IconWithTooltip icon={icon} label={label} />
          </a>
        )}
      </div>
    </div>
  );
};
const IconWithTooltip = ({ icon, label }) => {
  return (
    <div className="relative group">
      <div
        className="transform transition-transform duration-200 ease-in-out"
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = "scale(1.1) translateY(-5px)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.transform = "scale(1) translateY(0)")
        }
      >
        {icon}
      </div>
      <span className="tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-black bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
        {label}
      </span>
    </div>
  );
};

export default FloatingFeatures;
