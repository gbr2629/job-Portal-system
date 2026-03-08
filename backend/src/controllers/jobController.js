import User from "../models/userModel.js";
import Job from "../models/jobModel.js";


// Create Job
export const createJob = async (req, res) => {
  try {

    const { title, company, location, description, salary } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// Get All Jobs
export const getAllJobs = async (req, res) => {
  try {

    const jobs = await Job.find();

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// Search Job by Title
export const searchJob = async (req, res) => {
  try {

    const { title } = req.query;

    const jobs = await Job.find({
      title: { $regex: title, $options: "i" }
    });

    res.status(200).json({
      success: true,
      message: "Jobs found",
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching jobs",
      error: error.message
    });
  }
};



// Filter Jobs by Location
export const filterJobByLocation = async (req, res) => {
  try {

    const { location } = req.query;

    const jobs = await Job.find({
      location: { $regex: location, $options: "i" }
    });

    res.status(200).json({
      success: true,
      message: "Jobs filtered by location",
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error filtering jobs",
      error: error.message
    });
  }
};



// Update Job
export const updateJob = async (req, res) => {
  try {

    const { id } = req.params;

    const job = await Job.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// Delete Job
export const deleteJob = async (req, res) => {
  try {

    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();

    res.status(200).json({
      success: true,
      totalUsers,
      totalJobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};