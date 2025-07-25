import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";



function generateCertificateNumber(name, regNo, courseCode) {
  const input = `${name}-${regNo}-${courseCode}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash = hash & hash;
  }

  const timestamp = Date.now(); // Extra randomness
  const randomPart = Math.floor(Math.random() * 100000); // Add some randomness
  const combined = Math.abs(hash + timestamp + randomPart).toString(16);

  return combined.padEnd(16, "A2QTU").slice(0, 16).toUpperCase(); // use A instead of 0
}

const Certp5copy6 = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    regNo: "",
    email: "",
    courseCode: "",
    trainerName: "",
    whatsappNumber: "",
    date: "",
    file: null,
    filePath: "",
    branch: "",
  });

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [courseSuggestions, setCourseSuggestions] = useState([]);
  const courseRef = useRef(null);
  const [searchText, setSearchText] = useState("");
// const [previewUrl, setPreviewUrl] = useState(null);


  useEffect(() => {
  if (formData.file) {
    setPreviewUrl(URL.createObjectURL(formData.file));
  } else if (formData.filePath) {
    setPreviewUrl(`https://studback.onrender.com${formData.filePath}`);
  }
}, [formData.file, formData.filePath]);


  

  const fileInputRef = useRef(null);

const handleSearch = async () => {
  try {
    const searchQuery = searchText; // ✅ Fix here
    const response = await axios.get(
      `https://studback.onrender.com/api/students/search?q=${searchQuery}`
    );

    const data = response.data;
    const fileNameFromDB = data.file || ""; // ✅ Ensure file name exists

    setFormData((prev) => ({
      ...prev,
      ...data,
      file: null, // ⚠️ don’t override with Blob
      filePath: data.filePath, 
    }));

    setPreviewUrl(`https://studback.onrender.com/uploads/${fileNameFromDB}`); // ✅ Image path
    setImageName(fileNameFromDB);
    setMode("update");
  } catch (error) {
    if (error.response && error.response.status === 404) {
      alert("❌ Student not found. Please check the value or try again.");
    } else {
      alert("⚠️ Error fetching student.");
    }
    console.error("Error fetching student:", error);
  }
};



useEffect(() => {
  if (formData.file) {
    setPreviewUrl(URL.createObjectURL(formData.file));
  } else if (formData.filePath) {
    setPreviewUrl(
      `https://studback.onrender.com/uploads/${formData.filePath}`
    );
  }
}, [formData.file, formData.filePath]);

const fetchCourseSuggestions = async (value) => {
  try {
    const response = await axios.get(
      `https://studback.onrender.com/api/students/courses/search?q=${value}`
    );

    setCourseSuggestions(response.data);
  } catch (error) {
    console.error("Error fetching course suggestions:", error);
    setCourseSuggestions([]);
  }
};

useEffect(() => {
  if (formData.file) {
    setPreviewUrl(URL.createObjectURL(formData.file));
  } else if (formData.filePath) {
    setPreviewUrl(
      `https://studback.onrender.com/uploads/${formData.filePath}`
    );
  }
}, [formData.file, formData.filePath]);

// ✅ Paste the outside click detection useEffect below this
useEffect(() => {
  const handleClickOutside = (event) => {
    if (courseRef.current && !courseRef.current.contains(event.target)) {
      setCourseSuggestions([]); // Close the suggestion list
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  if (e.target.name === "courseCode") {
    fetchCourseSuggestions(e.target.value);
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData({ ...formData, file });
  }
};

const handleImageClick = () => {
  fileInputRef.current.click();
};



const prepareFormData = () => {
  const form = new FormData();
  Object.keys(formData).forEach((key) => {
    if (key !== "file" && key !== "filePath") {
      form.append(key, formData[key]);
    }
  });
  if (formData.file) {
    form.append("file", formData.file);
  }
  return form;
};

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const requiredFields = [
//     "fullName",
//     "regNo",
//     "email",
//     "courseCode",
//     "trainerName",
//     "whatsappNumber",
//     "date",
//     "branch",
//     "file",
//   ];
//   const emptyFields = requiredFields.filter((field) => !formData[field]);

//   if (emptyFields.length > 0) {
//     alert(`⚠️ Please fill all required fields: ${emptyFields.join(", ")}`);
//     return;
//   }

//   try {
//     const checkRes = await axios.get(
//       `https://studback.onrender.com/api/students/check-regno/${formData.regNo}`
//     );

//     if (checkRes.data.exists) {
//       alert("❌ This Registration Number already exists!");
//       return;
//     }
//   } catch (checkError) {
//     console.error("Error checking regNo:", checkError);
//     alert("❌ Error verifying registration number.");
//     return;
//   }

//   const certificateNumber = generateCertificateNumber(
//     formData.fullName,
//     formData.regNo,
//     formData.courseCode
//   );

//   try {
//     const data = new FormData();
//     for (const key in formData) {
//       data.append(key, formData[key]);
//     }
//     data.append("certificateNumber", certificateNumber);

//     const response = await axios.post(
//       "https://studback.onrender.com/api/students",
//       data,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );

//     alert("✅ Student submitted successfully!");
//     console.log(response.data);
//     resetForm();
//   } catch (error) {
//     console.error("Error submitting student:", error);
//     alert("❌ Error submitting student data.");
//   }
// };

const confirmUpdate = async () => {
  try {
    const data = prepareFormData();
    const response = await axios.put(
      `https://studback.onrender.com/api/students/${formData.regNo}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    alert("✅ Student updated successfully");
    console.log(response.data);
    resetForm();
  } catch (error) {
    console.error("❌ Error updating student:", error);
    alert("❌ Error updating student data.");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const requiredFields = [
    "fullName",
    "regNo",
    "email",
    "courseCode",
    "trainerName",
    "whatsappNumber",
    "date",
    "branch",
    "file",
  ];
  const emptyFields = requiredFields.filter((field) => !formData[field]);

  if (emptyFields.length > 0) {
    alert(`⚠️ Please fill all required fields: ${emptyFields.join(", ")}`);
    return;
  }

  try {
    // Check for duplicate registration number
    const checkRes = await axios.get(
      `https://studback.onrender.com/api/students/check-regno/${formData.regNo}`
    );

    if (checkRes.data.exists) {
      alert("❌ This Registration Number already exists!");
      return;
    }
  } catch (checkError) {
    console.error("Error checking regNo:", checkError);
    alert("❌ Error verifying registration number.");
    return;
  }

  // Generate certificate number
  const certificateNumber = generateCertificateNumber(
    formData.fullName,
    formData.regNo,
    formData.courseCode
  );

  try {
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append("certificateNumber", certificateNumber);

    const response = await axios.post(
      "https://studback.onrender.com/api/students",
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const responseData = response.data;

    // ✅ Set preview URL and image name for display
    if (responseData.filePath) {
      setPreviewUrl(`https://studback.onrender.com${responseData.filePath}`);
    }
    if (responseData.file) {
      setImageName(responseData.file);
    }

    alert("✅ Student submitted successfully!");
    console.log("Submitted Data:", responseData);

    // ✅ Reset form after setting preview info
    resetForm();
  } catch (error) {
    console.error("Error submitting student:", error);
    alert("❌ Error submitting student data.");
  }
};









  

const handleDelete = async () => {
  if (!formData.regNo) {
    alert("⚠️ Please enter the Reg. No to delete.");
    return;
  }
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this record?"
  );
  if (!confirmDelete) return;

  try {
    const response = await axios.delete(
      `https://studback.onrender.com/api/students/${formData.regNo}`
    );
    alert("🗑️ Student deleted successfully");
    console.log(response.data);
    resetForm();
  } catch (error) {
    console.error("Error deleting student:", error);
    alert("❌ Error deleting student data.");
  }
};





  const resetForm = () => {
    setFormData({
      fullName: "",
      regNo: "",
      email: "",
      courseCode: "",
      trainerName: "",
      whatsappNumber: "",
      date: "",
      file: null,
      filePath: "",
      branch: "",
    });
    setImageName("");
    setPreviewUrl("");
    setMode("");
    setStep(1);
  };

  const goToPreview = (e) => {
    e.preventDefault();
    if (!mode) setMode("submit");
    setStep(2);
  };
  const fntc = () => {
    window.location.reload(); // Page full refresh aagum
  };

  return (
    <div className="m">
      <FontAwesomeIcon
        icon={faXmark}
        style={{
          fontSize: "30px",
          position: "relative",
            left: "40%",
          padding: "10px",
        }}
        className="fntc"
        onClick={fntc}
      />
      <div className="m1">
        <div className="lot">
          <DotLottieReact
            src="https://lottie.host/1825f23c-2502-4542-9555-9f45f7a86d39/6LaaDBggbO.lottie"
            loop
            autoplay
          />
        </div>
      </div>
      <div className="m2">
        {step === 1 && (
          <form onSubmit={goToPreview}>
            <div className="main">
              <div className="certificate-container">
                <h2 className="form-heading">
                  CERTIFICATE REQUEST APPLICATION
                </h2>
              </div>
              <div className="form-row">
                <label>Universal Search:</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by Name / RegNo / Certificate Number"
                  />
                  {/* <button type="button" onClick={handleSearch}>
                    Search
                  </button> */}
                  <button
                    id="b1"
                    type="button"
                    onClick={handleSearch}
                    style={{ marginLeft: "10px" }}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="form-row">
                <label>Reg No:</label>
               
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                    placeholder="Reg No"
                    required
                    
                  />
                
              </div>

              <div className="form-row">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter Your Full Name"
                />
              </div>

              <div className="form-row">
                <label>Email ID:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter Your Email"
                />
              </div>
              <div className="form-row">
                <label>Wht Number:</label>

                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  maxLength={10}
                  pattern="^[0-9]{10}$"
                  title="Please enter exactly 10 digits"
                  placeholder="Enter Your Number"
                  required
                />
              </div>
              <div className="form-row">
                <label>Branch:</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  placeholder="Branch auto fills after Reg No search"
                />
              </div>
              <div className="form-row">
                <label>Course & Code:</label>
                <div ref={courseRef} className="form-row">
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    required
                    placeholder="Enter Your Course Code"
                    autoComplete="off"
                    style={{ width: "327px" }}
                  />
                  {courseSuggestions.length > 0 && (
                    <ul
                      style={{
                        listStyle: "none",
                        padding: "5px",
                        transform: "translateY(100px)",
                        marginLeft: "0px",
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        position: "absolute",
                        top: "520px",
                        zIndex: "10",
                        width: "327px",
                        maxHeight: "122px",
                        overflowY: "auto",
                      }}
                    >
                      {courseSuggestions.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              courseCode: item,
                            }));
                            setCourseSuggestions([]);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundImage =
                              "linear-gradient(to right, #71b7e6, #9b59b6)";
                            e.target.style.color = "black"; // optional, to make text visible
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundImage = "";
                          }}
                          style={{
                            padding: "5px",
                            cursor: "pointer",
                            transition: "background-image 0.2s ease-in-out",
                            backgroundImage: "", // initial value
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="form-row">
                <label>Trainer Name:</label>
                <input
                  type="text"
                  name="trainerName"
                  value={formData.trainerName}
                  onChange={handleChange}
                  required
                  placeholder="Enter Your Trainer Name"
                />
              </div>
              <div className="form-row">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Upload File:</label>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <img
                    src="upload.png"
                    alt="Upload"
                    onClick={handleImageClick}
                    style={{ width: "60px", height: "60px", cursor: "pointer" }}
                  />
                  {formData.file && (
                    <>
                      <p style={{ fontSize: "14px" }}>{formData.file.name}</p>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          width: "120px",
                          marginTop: "10px",
                          borderRadius: "10px",
                        }}
                      />
                    </>
                  )}
                  {imageName && (
                    <p
                      style={{
                        fontStyle: "italic",
                        fontSize: "14px",
                        marginTop: "8px",
                        color: "gray",
                      }}
                    >
                      📂 Image in DB: {imageName}
                    </p>
                  )}
                </div>
              </div>
              <div
                className="form-row button-row"
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <button onClick={() => setStep(1)} className="btn">
                  Preview
                </button>
                {mode === "update" ? (
                  <button onClick={confirmUpdate} className="btn">
                    Confirm Update
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="btn">
                    Confirm & Submit
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
        {step === 2 &&
          (() => {
            const certificateNumber = generateCertificateNumber(
              formData.fullName,
              formData.regNo,
              formData.courseCode
            );
            return (
              <div
                className="preview-container"
                style={{ width: "800px", margin: "auto" }}
              >
                <h2 style={{ textAlign: "center" }}>Preview Your Details</h2>
                {(formData.file || formData.filePath) && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <p style={{ textAlign: "center" }}>
                        <strong>
                          {formData.file
                            ? "Uploaded Image:"
                            : "Existing Image:"}
                        </strong>
                      </p>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          width: "138px",
                          height: "177px",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  </div>
                )}
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#4a4a4a",
                    marginBottom: "15px",
                  }}
                >
                  Certificate No: {certificateNumber}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    { label: "Certificate No", value: certificateNumber },
                    { label: "Full Name", value: formData.fullName },
                    { label: "Reg. No", value: formData.regNo },
                    { label: "Email", value: formData.email },
                    {
                      label: "Whatsapp Number",
                      value: formData.whatsappNumber,
                    },
                    { label: "Branch", value: formData.branch },
                    { label: "Course & Code", value: formData.courseCode },
                    { label: "Trainer Name", value: formData.trainerName },
                    { label: "Date", value: formData.date },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <span style={{ fontWeight: "600", width: "40%" }}>
                        {item.label}
                      </span>
                      <span style={{ width: "60%", textAlign: "right" }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <button onClick={() => setStep(1)} className="btn">
                    Edit
                  </button>
                  {mode === "update" ? (
                    <button onClick={confirmUpdate} className="btn">
                      Confirm Update
                    </button>
                  ) : (
                    <button onClick={handleSubmit} className="btn">
                      Confirm & Submit
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="btn"
                    style={{ backgroundColor: "#e74c3c" }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
};

export default Certp5copy6;
