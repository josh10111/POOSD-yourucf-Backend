require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import updated models
const User = require('./models/User');
const Course = require('./models/Course');
const PlanOfStudy = require('./models/PlanOfStudy');

// MongoDB connection URI
const uri = process.env.MONGODB_URI ||"mongodb+srv://root:COP4331@largeproject.gt6ia.mongodb.net/?retryWrites=true&w=majority&appName=LargeProject";

// Connect to MongoDB
mongoose.connect(uri, {serverSelectionTimeoutMS: 10000,})
  .then(() => {
    console.log("MongoDB connected for seeding.");
    seedData();
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
  
// **Courses Without Prerequisites**
const courses = [
  { courseCode: "STA2023", courseName: "Statistical Methods I", description: "Statistical Methods I", creditHours: 3, prerequisites: [], semestersOffered: ['Fall', 'Spring', 'Summer'] },
  { courseCode: "COP3502C", courseName: "Computer Science I", description: "Computer Science I", creditHours: 3, prerequisites: [], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "CDA3103C", courseName: "Computer Logic and Organization", description: "Computer Logic and Organization", creditHours: 3, prerequisites: [], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "COT3100C", courseName: "Introduction to Discrete Structures", description: "Introduction to Discrete Structures", creditHours: 3, prerequisites: [], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "COT3960", courseName: "Foundation Exam", description: "Foundation Exam", creditHours: 0, prerequisites: [], semestersOffered: ['Fall', 'Spring', 'Summer'] },
  { courseCode: "ENC3241", courseName: "Writing for the Technical Professional", description: "Writing for the Technical Professional", creditHours: 3, prerequisites: [], semestersOffered: ['Fall', 'Spring', 'Summer'] },
  { courseCode: "ENC3250", courseName: "Professional Writing", description: "Professional Writing", creditHours: 3, prerequisites: [], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "BSC2010C", courseName: "Biology I", description: "Biology I", creditHours: 4, prerequisites: [], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "CHM2045C", courseName: "Chemistry Fundamentals I", description: "Chemistry Fundamentals I", creditHours: 4, prerequisites: [], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "SPC1603C", courseName: "Fundamentals of Technical Presentations", description: "Fundamentals of Technical Presentations", creditHours: 3, prerequisites: [], semestersOffered: ['Fall', 'Spring', 'Summer'] },
  { courseCode: "ENC1101", courseName: "Composition I", description: "Composition I", creditHours: 3, prerequisites: [], semestersOffered: ['Fall', 'Spring', 'Summer'] },
];

// **Courses With Prerequisites**
const coursesPrerequisite = [
  { courseCode: "COP3330", courseName: "Object Oriented Programming", description: "Object Oriented Programming", creditHours: 3, prerequisites: ['COP3502C'], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "COP3503C", courseName: "Computer Science II", description: "Computer Science II", creditHours: 3, prerequisites: ['COP3502C'], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "CIS3360", courseName: "Security in Computing", description: "Security in Computing", creditHours: 3, prerequisites: ['COP3503C'], semestersOffered: ['Spring'] },
  { courseCode: "COP3402", courseName: "Systems Software", description: "Systems Software", creditHours: 3, prerequisites: ['CDA3103C'], semestersOffered: ['Fall'] },
  { courseCode: "COT4210", courseName: "Discrete Structures II", description: "Discrete Structures II", creditHours: 3, prerequisites: ['COT3100C'], semestersOffered: ['Spring'] },
  { courseCode: "COP4331C", courseName: "Processes for Object-Oriented Software Development", description: "Processes for Object-Oriented Software Development", creditHours: 3, prerequisites: ['COP3503C'], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "COP4600", courseName: "Operating Systems", description: "Operating Systems", creditHours: 3, prerequisites: ['COP3402'], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "CAP4611", courseName: "Algorithms for Machine Learning", description: "Algorithms for Machine Learning", creditHours: 3, prerequisites: ['COT4210'], semestersOffered: ['Spring'] },
  { courseCode: "CAP4630", courseName: "Artificial Intelligence", description: "Artificial Intelligence", creditHours: 3, prerequisites: ['COP3503C'], semestersOffered: ['Fall'] },
  { courseCode: "COP4710", courseName: "Database Systems", description: "Database Systems", creditHours: 3, prerequisites: ['COP3503C'], semestersOffered: ['Spring'] },
  { courseCode: "COP4934", courseName: "Senior Design I", description: "Senior Design I", creditHours: 3, prerequisites: ['COP4331C'], semestersOffered: ['Fall'] },
  { courseCode: "COP4935", courseName: "Senior Design II", description: "Senior Design II", creditHours: 3, prerequisites: ['COP4934'], semestersOffered: ['Spring'] },
  { courseCode: "CDA5106", courseName: "Advanced Computer Architecture", description: "Advanced Computer Architecture", creditHours: 3, prerequisites: ['CDA3103C'], semestersOffered: ['Fall'] },
  { courseCode: "COP4520", courseName: "Concepts of Parallel and Distributed Processing", description: "Concepts of Parallel and Distributed Processing", creditHours: 3, prerequisites: ['COP3503C'], semestersOffered: ['Spring'] },
  { courseCode: "COP5611", courseName: "Operating Systems Design Principles", description: "Operating Systems Design Principles", creditHours: 3, prerequisites: ['COP4600'], semestersOffered: ['Fall'] },
  { courseCode: "COP5711", courseName: "Parallel and Distributed Database Systems", description: "Parallel and Distributed Database Systems", creditHours: 3, prerequisites: ['COP4710'], semestersOffered: ['Spring'] },
  { courseCode: "CAP5512", courseName: "Evolutionary Computation", description: "Evolutionary Computation", creditHours: 3, prerequisites: ['CAP4630'], semestersOffered: ['Fall'] },
  { courseCode: "MAP2302", courseName: "Ordinary Differential Equations I", description: "Ordinary Differential Equations I", creditHours: 3, prerequisites: ['MAC2312'], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "MAS3105", courseName: "Matrix and Linear Algebra", description: "Matrix and Linear Algebra", creditHours: 4, prerequisites: ['MAC2311C'], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "MAC2313", courseName: "Calculus with Analytic Geometry III", description: "Calculus with Analytic Geometry III", creditHours: 4, prerequisites: ['MAC2312'], semestersOffered: ['Fall', 'Spring', 'Summer'] },
  { courseCode: "CAP4053", courseName: "AI for Game Programming", description: "AI for Game Programming", creditHours: 3, prerequisites: ['COP3503C'], semestersOffered: ['Spring'] },
  { courseCode: "ENC1102", courseName: "Composition II", description: "Composition II", creditHours: 3, prerequisites: ['ENC1101'], semestersOffered: ['Fall', 'Spring', 'Summer'] },
  { courseCode: "CAP4453", courseName: "Robot Vision", description: "Robot Vision", creditHours: 3, prerequisites: ['CAP4611'], semestersOffered: ['Fall'] },
  { courseCode: "CAP5415", courseName: "Computer Vision", description: "Computer Vision", creditHours: 3, prerequisites: ['CAP4611'], semestersOffered: ['Spring'] },
  { courseCode: "CAP5610", courseName: "Machine Learning", description: "Machine Learning", creditHours: 3, prerequisites: ['CAP4611'], semestersOffered: ['Fall'] },
  { courseCode: "CEN5016", courseName: "Software Engineering", description: "Software Engineering", creditHours: 3, prerequisites: ['COP4331C'], semestersOffered: ['Spring'] },
  { courseCode: "CIS4615", courseName: "Secure Software Development and Assurance", description: "Secure Software Development and Assurance", creditHours: 3, prerequisites: ['CIS3360'], semestersOffered: ['Fall'] },
  { courseCode: "COP4020", courseName: "Programming Languages I", description: "Programming Languages I", creditHours: 3, prerequisites: ['COP3503C'], semestersOffered: ['Spring'] },
  { courseCode: "CAP4145", courseName: "Introduction to Malware Analysis", description: "Introduction to Malware Analysis", creditHours: 3, prerequisites: ['CIS3360'], semestersOffered: ['Fall'] },
  { courseCode: "CIS3362", courseName: "Cryptography and Information Security", description: "Cryptography and Information Security", creditHours: 3, prerequisites: ['COT3100C'], semestersOffered: ['Spring'] },
  { courseCode: "CIS4203C", courseName: "Digital Forensics", description: "Digital Forensics", creditHours: 3, prerequisites: ['CIS3360'], semestersOffered: ['Fall'] },
  { courseCode: "CNT4403", courseName: "Network Security and Privacy", description: "Network Security and Privacy", creditHours: 3, prerequisites: ['CIS3360'], semestersOffered: ['Spring'] },
  { courseCode: "CNT5008", courseName: "Computer Communication Networks Architecture", description: "Computer Communication Networks Architecture", creditHours: 3, prerequisites: ['COP3503C'], semestersOffered: ['Fall'] },
  { courseCode: "CAP4720", courseName: "Computer Graphics", description: "Computer Graphics", creditHours: 3, prerequisites: ['COP3503C'], semestersOffered: ['Spring'] },
  { courseCode: "EEL4660", courseName: "Robotic Systems", description: "Robotic Systems", creditHours: 3, prerequisites: ['CAP4453'], semestersOffered: ['Fall'] },
  { courseCode: "PHY2048C", courseName: "General Physics Using Calculus I", description: "General Physics Using Calculus I", creditHours: 4, prerequisites: ['MAC2311C'], semestersOffered: ['Fall', 'Spring'] },
  { courseCode: "PHY2049C", courseName: "General Physics Using Calculus II", description: "General Physics Using Calculus II", creditHours: 4, prerequisites: ['PHY2048C'], semestersOffered: ['Spring'] },
];

// Seeding Function
async function seedData() {
	try {
	  // **1. Clear Existing Data**
	  await User.deleteMany({});
	  await Course.deleteMany({});
	  await PlanOfStudy.deleteMany({});
	  console.log("Existing data cleared.");
  
	  // **2. Create Users**
	  const salt = await bcrypt.genSalt(10);
	  const hashedPassword = await bcrypt.hash("password123", salt);
	  const users = await User.insertMany([
		  { firstName: "John", lastName: "Doe", username: "john_doe", email: "john@example.com", password: hashedPassword, isValid: true },
		  { firstName: "Jane", lastName: "Doe", username: "jane_doe", email: "jane@example.com", password: hashedPassword, isValid: false },
	  ]);
	  console.log("Inserted Users:", users);
  
	  // **3. Create Courses**
	  // Insert Courses Without Prerequisites First
	  const createdCourses = await Course.insertMany(
		courses.map(course => ({
		  ...course,
		  prerequisites: []
		}))
	  );
	  console.log("Courses without prerequisites inserted successfully.");
  
	  // Create a Map of Course Codes to ObjectIds
	  const courseMap = createdCourses.reduce((acc, course) => {
		acc[course.courseCode] = course._id;
		return acc;
	  }, {});
  
	  // Insert Courses With Prerequisites
	  const createdCoursesWithPrerequisites = await Course.insertMany(
		coursesPrerequisite.map(course => ({
		  ...course,
		  prerequisites: course.prerequisites.map(prereq => courseMap[prereq]).filter(Boolean)
		}))
	  );
	  console.log("Courses with prerequisites inserted successfully.");
  
	  // Combine all courses for reference
	  const allCourses = [...createdCourses, ...createdCoursesWithPrerequisites];
	  const fullCourseMap = allCourses.reduce((acc, course) => {
		acc[course.courseCode] = course;
		return acc;
	  }, {});
  
	  // **4. Create a Complete 4-Year Plan of Study**
	  const planData = {
		studentId: users[0]._id,
		semesters: [
		  // Year 1 - Fall
		  {
			semester: "Fall",
			year: 2025,
			courses: [
			  { 
				courseId: fullCourseMap["COP3502C"]._id, // Use full course reference
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["ENC1101"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["STA2023"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["CHM2045C"]._id,
				status: "Completed" 
			  }
			]
		  },
		  // Year 1 - Spring
		  {
			semester: "Spring",
			year: 2026,
			courses: [
			  { 
				courseId: fullCourseMap["COP3503C"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["CDA3103C"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["ENC1102"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["PHY2048C"]._id,
				status: "Completed" 
			  }
			]
		  },
		  // Year 1 - Summer
		  {
			semester: "Summer",
			year: 2026,
			courses: [
			  { 
				courseId: fullCourseMap["COT3100C"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["SPC1603C"]._id,
				status: "Completed" 
			  }
			]
		  },
		  // Year 2 - Fall
		  {
			semester: "Fall",
			year: 2026,
			courses: [
			  { 
				courseId: fullCourseMap["COP3402"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["COP3330"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["PHY2049C"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["ENC3241"]._id,
				status: "Completed" 
			  }
			]
		  },
		  // Year 2 - Spring
		  {
			semester: "Spring",
			year: 2027,
			courses: [
			  { 
				courseId: fullCourseMap["COT4210"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["CIS3360"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["COP4331C"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["BSC2010C"]._id,
				status: "Completed" 
			  }
			]
		  },
		  // Year 2 - Summer
		  {
			semester: "Summer",
			year: 2027,
			courses: [
			  { 
				courseId: fullCourseMap["COT3960"]._id,
				status: "Completed" 
			  },
			  { 
				courseId: fullCourseMap["ENC3250"]._id,
				status: "Completed" 
			  }
			]
		  },
		  // Year 3 - Fall
		  {
			semester: "Fall",
			year: 2027,
			courses: [
			  { 
				courseId: fullCourseMap["COP4600"]._id,
				status: "Planned" 
			  },
			  { 
				courseId: fullCourseMap["CAP4630"]._id,
				status: "Planned" 
			  },
			  { 
				courseId: fullCourseMap["CDA5106"]._id,
				status: "Planned" 
			  }
			]
		  },
		  // Year 3 - Spring
		  {
			semester: "Spring",
			year: 2028,
			courses: [
			  { 
				courseId: fullCourseMap["CAP4611"]._id,
				status: "Planned" 
			  },
			  { 
				courseId: fullCourseMap["COP4710"]._id,
				status: "Planned" 
			  },
			  { 
				courseId: fullCourseMap["CIS3362"]._id,
				status: "Planned" 
			  }
			]
		  },
		  // Year 3 - Summer
		  {
			semester: "Summer",
			year: 2028,
			courses: [
			  { 
				courseId: fullCourseMap["CAP4053"]._id,
				status: "Planned" 
			  },
			  { 
				courseId: fullCourseMap["MAC2313"]._id,
				status: "Planned" 
			  }
			]
		  },
		  // Year 4 - Fall
		  {
			semester: "Fall",
			year: 2028,
			courses: [
			  { 
				courseId: fullCourseMap["COP4934"]._id,
				status: "Planned" 
			  },
			  { 
				courseId: fullCourseMap["CAP4453"]._id,
				status: "Planned" 
			  },
			  { 
				courseId: fullCourseMap["CIS4615"]._id,
				status: "Planned" 
			  }
			]
		  },
		  // Year 4 - Spring
		  {
			semester: "Spring",
			year: 2029,
			courses: [
			  { 
				courseId: fullCourseMap["COP4935"]._id,
				status: "Planned" 
			  },
			  { 
				courseId: fullCourseMap["CAP5415"]._id,
				status: "Planned" 
			  },
			  { 
				courseId: fullCourseMap["CEN5016"]._id,
				status: "Planned" 
			  }
			]
		  }
		],
		totalCredits: 120
	  };
  
	  // Create the plan
	  const plan = new PlanOfStudy(planData);
	  const savedPlan = await plan.save();
	  
	  // Populate the plan with full course details
	  const populatedPlan = await PlanOfStudy.findById(savedPlan._id)
		.populate({
		  path: 'semesters.courses.courseId',
		  select: 'courseCode courseName description creditHours prerequisites semestersOffered'
		})
		.populate('studentId', 'firstName lastName username email');
  
	  console.log("Inserted Plan of Study:", JSON.stringify(populatedPlan, null, 2));
	  console.log("Seeding completed successfully.");
	  process.exit(0);
	} catch (error) {
	  console.error("Error during seeding:", error);
	  process.exit(1);
	}
  }
